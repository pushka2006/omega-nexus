'use client';

const CODE = `// SmartShop SaaS – payment.controller.js
async function processPayment(req, res) {
  const { orderId, amount, method } = req.body;
  const order = await Order.findById(orderId);

  if (!order || order.status !== 'pending') {
    return res.status(400).json({ error: 'Invalid order' });
  }

  const payment = await stripe.charges.create({
    amount: amount * 100,
    currency: 'usd',
    source: method.token,
    description: \`Order #\${orderId}\`,
  });

  order.status = 'paid';
  order.paymentId = payment.id;
  await order.save();

  await notifyAgent('finance', { orderId, amount });
  res.json({ success: true, paymentId: payment.id });
}`;

const TERMINAL = `$ npm run build
> smartshop-saas@2.0.0 build
> next build

✓ Compiled successfully
✓ Linting and checking types
✓ Collecting page data
✓ Generating static pages (24/24)
✓ Finalizing page optimization

Route (app)                Size
┌ ○ /                      142 kB
├ ○ /dashboard             89 kB
├ ○ /products              56 kB
└ ○ /checkout              34 kB

Build completed in 12.4s`;

export default function CodeStudio() {
  const files = ['payment.controller.js', 'order.model.js', 'stripe.service.js', 'routes/api.js', 'middleware/auth.js'];

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="card-header">Code Studio – SmartShop SaaS</div>
      <div style={{ display: 'flex', flex: 1, gap: '8px', minHeight: '200px' }}>
        <div style={{ width: '140px', fontSize: '11px', borderRight: '1px solid var(--border-color)', paddingRight: '8px' }}>
          {files.map(f => (
            <div key={f} style={{
              padding: '4px 8px', borderRadius: '4px', cursor: 'pointer',
              background: f === 'payment.controller.js' ? 'rgba(59,130,246,0.1)' : 'transparent',
              color: f === 'payment.controller.js' ? 'var(--accent-blue)' : 'var(--text-secondary)',
            }}>{f}</div>
          ))}
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <pre style={{
            flex: 1, fontSize: '10px', lineHeight: '1.5', overflow: 'auto',
            background: 'var(--bg-primary)', padding: '8px', borderRadius: '6px', color: '#a5b4fc',
          }}>{CODE}</pre>
          <pre style={{
            fontSize: '10px', lineHeight: '1.4', overflow: 'auto', maxHeight: '80px',
            background: '#0d1117', padding: '8px', borderRadius: '6px', color: 'var(--accent-green)',
          }}>{TERMINAL}</pre>
        </div>
      </div>
    </div>
  );
}
