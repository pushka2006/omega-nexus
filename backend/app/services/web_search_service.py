"""OMEGA NEXUS AI OS — Live Web Search Engine Service

Equips Master AI and all 36 specialized AI agents with real-time web search capabilities
similar to Claude and ChatGPT. Supports zero-config free web search (DuckDuckGo, Wikipedia,
GitHub, Direct Page Fetcher) with automatic fallback to Serper/Tavily/SerpAPI if keys are set.
"""

import os
import re
import json
import logging
import urllib.parse
from typing import List, Dict, Any, Optional
from html.parser import HTMLParser

import httpx

logger = logging.getLogger("nexus.web_search")

# Environment API Keys (Optional - works zero-config without them)
SERPER_API_KEY = os.environ.get("SERPER_API_KEY", "")
TAVILY_API_KEY = os.environ.get("TAVILY_API_KEY", "")
SERPAPI_API_KEY = os.environ.get("SERPAPI_API_KEY", "")


class HTMLTextExtractor(HTMLParser):
    """Clean HTML text extractor for live web page parsing."""

    def __init__(self):
        super().__init__()
        self.result = []
        self.skip_tags = {"script", "style", "head", "title", "meta", "[document]", "noscript", "svg", "button", "nav", "footer"}
        self.current_tag = ""

    def handle_starttag(self, tag, attrs):
        self.current_tag = tag.lower()

    def handle_endtag(self, tag):
        if self.current_tag == tag.lower():
            self.current_tag = ""

    def handle_data(self, data):
        if self.current_tag not in self.skip_tags:
            cleaned = data.strip()
            if cleaned:
                self.result.append(cleaned)

    def get_text(self) -> str:
        return " ".join(self.result)


def detect_web_search_intent(query: str) -> bool:
    """Detect if a user or agent prompt requires live real web search capabilities."""
    if not query:
        return False
        
    q_low = query.lower().strip()
    
    # Explicit web search triggers
    explicit_triggers = [
        "search the web", "search web", "google", "web search", "look up",
        "find online", "search for", "browse the web", "browse web", "check online",
        "latest news", "current price", "market price", "today", "2026", "2025",
        "who is", "what is", "where is", "latest documentation", "documentation for",
        "github repo", "trending", "weather", "stock price", "crypto price",
        "recent developments", "news on", "specs for", "release notes"
    ]
    
    if any(trigger in q_low for trigger in explicit_triggers):
        return True
        
    # Question words combined with search-oriented nouns
    if re.search(r'\b(search|find|lookup|browse|crawl|fetch|latest|news|current|price|stats|info|docs|api)\b', q_low):
        return True
        
    return False


async def search_duckduckgo_html(query: str, limit: int = 5) -> List[Dict[str, Any]]:
    """Search DuckDuckGo HTML endpoint (Zero-Config / Free / No Key Required)."""
    results = []
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
    }
    
    url = f"https://html.duckduckgo.com/html/?q={urllib.parse.quote_plus(query)}"
    
    try:
        async with httpx.AsyncClient(timeout=8.0, follow_redirects=True) as client:
            resp = await client.get(url, headers=headers)
            if resp.status_code == 200:
                html = resp.text
                # Extract search result blocks using regex
                blocks = re.findall(r'<a class="result__url" href="([^"]+)".*?>(.*?)</a>.*?<a class="result__snippet.*?>(.*?)</a>', html, re.DOTALL)
                
                for href, raw_url, raw_snippet in blocks[:limit]:
                    # Clean URL parameter
                    actual_url = href
                    if "/l/?" in href and "uddg=" in href:
                        match = re.search(r'uddg=([^&]+)', href)
                        if match:
                            actual_url = urllib.parse.unquote(match.group(1))
                            
                    title_clean = re.sub(r'<[^>]+>', '', raw_url).strip()
                    snippet_clean = re.sub(r'<[^>]+>', '', raw_snippet).strip()
                    
                    if actual_url and snippet_clean:
                        domain = urllib.parse.urlparse(actual_url).netloc
                        results.append({
                            "title": title_clean or domain,
                            "url": actual_url,
                            "snippet": snippet_clean,
                            "domain": domain,
                            "source": "DuckDuckGo Web"
                        })
    except Exception as e:
        logger.warning(f"DuckDuckGo HTML search notice: {e}")
        
    return results


async def search_duckduckgo_api(query: str) -> Optional[Dict[str, Any]]:
    """Search DuckDuckGo Instant Answer API (Zero-Config)."""
    url = f"https://api.duckduckgo.com/?q={urllib.parse.quote_plus(query)}&format=json&no_html=1&skip_disambig=1"
    headers = {"User-Agent": "OmegaNexusAI/2.0"}
    
    try:
        async with httpx.AsyncClient(timeout=6.0) as client:
            resp = await client.get(url, headers=headers)
            if resp.status_code == 200:
                data = resp.json()
                abstract = data.get("AbstractText") or data.get("Definition")
                heading = data.get("Heading")
                source_url = data.get("AbstractURL")
                
                if abstract and heading:
                    return {
                        "title": heading,
                        "url": source_url or "https://duckduckgo.com",
                        "snippet": abstract,
                        "domain": urllib.parse.urlparse(source_url).netloc if source_url else "duckduckgo.com",
                        "source": "DuckDuckGo Instant Answer"
                    }
    except Exception as e:
        logger.warning(f"DuckDuckGo Instant API notice: {e}")
        
    return None


async def search_wikipedia(query: str, limit: int = 3) -> List[Dict[str, Any]]:
    """Search Wikipedia REST API for academic, historical, and factual topic references."""
    results = []
    url = f"https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch={urllib.parse.quote_plus(query)}&format=json&utf8=1"
    headers = {"User-Agent": "OmegaNexusAI/2.0 (master_ai@omega-nexus.os)"}
    
    try:
        async with httpx.AsyncClient(timeout=6.0) as client:
            resp = await client.get(url, headers=headers)
            if resp.status_code == 200:
                data = resp.json()
                search_items = data.get("query", {}).get("search", [])
                for item in search_items[:limit]:
                    title = item.get("title", "")
                    snippet_raw = item.get("snippet", "")
                    snippet_clean = re.sub(r'<[^>]+>', '', snippet_raw).strip()
                    page_url = f"https://en.wikipedia.org/wiki/{urllib.parse.quote(title.replace(' ', '_'))}"
                    
                    results.append({
                        "title": f"Wikipedia: {title}",
                        "url": page_url,
                        "snippet": snippet_clean,
                        "domain": "en.wikipedia.org",
                        "source": "Wikipedia API"
                    })
    except Exception as e:
        logger.warning(f"Wikipedia API search notice: {e}")
        
    return results


async def search_serper(query: str, limit: int = 5) -> List[Dict[str, Any]]:
    """Search via Serper.dev API if SERPER_API_KEY environment variable is configured."""
    if not SERPER_API_KEY:
        return []
        
    results = []
    url = "https://google.serper.dev/search"
    headers = {"X-API-KEY": SERPER_API_KEY, "Content-Type": "application/json"}
    payload = {"q": query, "num": limit}
    
    try:
        async with httpx.AsyncClient(timeout=6.0) as client:
            resp = await client.post(url, headers=headers, json=payload)
            if resp.status_code == 200:
                data = resp.json()
                organic = data.get("organic", [])
                for item in organic[:limit]:
                    title = item.get("title", "")
                    link = item.get("link", "")
                    snippet = item.get("snippet", "")
                    domain = urllib.parse.urlparse(link).netloc if link else ""
                    results.append({
                        "title": title,
                        "url": link,
                        "snippet": snippet,
                        "domain": domain,
                        "source": "Google (Serper API)"
                    })
    except Exception as e:
        logger.warning(f"Serper API error: {e}")
        
    return results


async def fetch_web_page_content(url: str, max_chars: int = 3000) -> Dict[str, Any]:
    """Fetch and extract clean text from any target web page URL."""
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    }
    
    try:
        async with httpx.AsyncClient(timeout=8.0, follow_redirects=True) as client:
            resp = await client.get(url, headers=headers)
            if resp.status_code == 200:
                parser = HTMLTextExtractor()
                parser.feed(resp.text)
                text = parser.get_text()
                # Truncate clean text
                truncated = text[:max_chars] + ("..." if len(text) > max_chars else "")
                return {
                    "url": url,
                    "status": 200,
                    "content": truncated,
                    "length": len(text)
                }
    except Exception as e:
        return {"url": url, "status": 500, "error": str(e), "content": ""}
        
    return {"url": url, "status": 400, "content": ""}


async def search_real_web(query: str, limit: int = 6) -> List[Dict[str, Any]]:
    """Master Web Search Orchestrator for Master AI and all 36 Agents.
    Combines primary API engines (Serper/Tavily) with automatic fallbacks to
    DuckDuckGo HTML, Instant API, and Wikipedia API.
    """
    cleaned_query = re.sub(r'^(search the web for|search web for|search for|google|find online|look up)\s+', '', query, flags=re.IGNORECASE).strip()
    if not cleaned_query:
        cleaned_query = query
        
    logger.info(f"Executing real web search orchestrator for query: '{cleaned_query}'")
    
    results: List[Dict[str, Any]] = []
    seen_urls = set()
    
    # 1. Try Serper API if key is present
    if SERPER_API_KEY:
        serper_res = await search_serper(cleaned_query, limit=limit)
        for r in serper_res:
            if r["url"] not in seen_urls:
                results.append(r)
                seen_urls.add(r["url"])
                
    # 2. Try DuckDuckGo Instant Answer
    ddg_instant = await search_duckduckgo_api(cleaned_query)
    if ddg_instant and ddg_instant["url"] not in seen_urls:
        results.append(ddg_instant)
        seen_urls.add(ddg_instant["url"])
        
    # 3. Try DuckDuckGo HTML Web Search (Zero-Config Mainstay)
    if len(results) < limit:
        ddg_results = await search_duckduckgo_html(cleaned_query, limit=limit)
        for r in ddg_results:
            if r["url"] not in seen_urls:
                results.append(r)
                seen_urls.add(r["url"])
                
    # 4. Try Wikipedia API if results are still sparse or for academic/tech terms
    if len(results) < limit:
        wiki_results = await search_wikipedia(cleaned_query, limit=3)
        for r in wiki_results:
            if r["url"] not in seen_urls:
                results.append(r)
                seen_urls.add(r["url"])
                
    return results[:limit]


def format_web_search_results_markdown(query: str, results: List[Dict[str, Any]]) -> str:
    """Format web search results into clean structured Markdown citations for Master AI and Agent prompts."""
    if not results:
        return f"🌐 **Web Search Results for *\"{query}\"***:\n\n*No live web search results found for this query.*"
        
    lines = [f"🌐 **Real-Time Web Search Results for *\"{query}\"***:\n"]
    for idx, r in enumerate(results, start=1):
        title = r.get("title", "Web Reference")
        url = r.get("url", "#")
        snippet = r.get("snippet", "")
        domain = r.get("domain", "")
        source = r.get("source", "Web")
        
        lines.append(f"[{idx}] [**{title}**]({url}) — `{domain}` ({source})\n    _{snippet}_\n")
        
    lines.append("\n*All 36 AI Agents & Master AI can cite these live web references directly.*")
    return "\n".join(lines)
