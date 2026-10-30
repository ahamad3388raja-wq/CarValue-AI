import React from 'react';
import { useState } from 'react';
import { CarFront, Gauge, IndianRupee, RotateCcw, Sparkles, TrendingDown, ShieldCheck } from 'lucide-react';

const initial = {
  brand:'Maruti', year:2019, km_driven:50000, fuel:'Petrol',
  transmission:'Manual', owner:'First Owner', mileage:18,
  engine_cc:1197, max_power_bhp:82
};
const money = n => new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(n);

export default function App() {
  const [form,setForm] = useState(initial);
  const [result,setResult] = useState(null);
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState('');
  const update = (key,value) => setForm(old=>({...old,[key]:value}));
  const predict = async e => {
    e.preventDefault(); setLoading(true); setError(''); setResult(null);
    try {
      const response = await fetch('http://127.0.0.1:8000/predict',{
        method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({
          ...form, year:Number(form.year), km_driven:Number(form.km_driven),
          mileage:Number(form.mileage), engine_cc:Number(form.engine_cc),
          max_power_bhp:Number(form.max_power_bhp)
        })
      });
      const data = await response.json();
      if(!response.ok) throw new Error(data.detail || 'Prediction failed. Is the backend running and model trained?');
      setResult(data);
    } catch(err) { setError(err.message || 'Could not connect to API.'); }
    finally { setLoading(false); }
  };
  const reset = () => {setForm(initial);setResult(null);setError('');};
  const field = (label,key,opts) => <label className="field"><span>{label}</span>
    {opts ? <select value={form[key]} onChange={e=>update(key,e.target.value)}>{opts.map(x=><option key={x}>{x}</option>)}</select>
    : <input type="number" value={form[key]} onChange={e=>update(key,e.target.value)} required min="0"/>}
  </label>;
  return <main className="shell">
    <nav className="nav"><div className="brand"><span className="brandIcon"><CarFront size={22}/></span>CarValue <b>AI</b></div><span className="navTag"><span className="dot"/> MODEL-POWERED VALUATION</span></nav>
    <section className="hero"><div className="eyebrow"><Sparkles size={15}/> SMART RESALE ESTIMATOR</div>
      <h1>Know what your car<br/><em>is really worth.</em></h1>
      <p>Enter your vehicle details to get an indicative resale price estimate powered by machine learning.</p>
    </section>
    <div className="layout">
      <form className="panel formPanel" onSubmit={predict}>
        <div className="panelHead"><div><h2>Vehicle details</h2><p>Tell us a little about the car</p></div><span className="step">01 / DETAILS</span></div>
        <div className="formGrid">
          {field('Brand','brand',['Maruti','Hyundai','Honda','Tata','Toyota','Mahindra','Kia','Ford','Volkswagen','Renault','Skoda','Nissan'])}
          {field('Manufacturing year','year')}
          {field('Kilometres driven','km_driven')}
          {field('Fuel type','fuel',['Petrol','Diesel','CNG','LPG','Electric'])}
          {field('Transmission','transmission',['Manual','Automatic'])}
          {field('Ownership','owner',['First Owner','Second Owner','Third Owner','Fourth & Above Owner','Test Drive Car'])}
          {field('Mileage (km/l)','mileage')}
          {field('Engine (CC)','engine_cc')}
          {field('Power (BHP)','max_power_bhp')}
        </div>
        <div className="actions"><button className="primary" disabled={loading}>{loading?'Calculating...':<><Sparkles size={17}/> Predict resale price</>}</button><button type="button" className="reset" onClick={reset}><RotateCcw size={15}/> Reset</button></div>
        {error && <div className="error">{error}</div>}
      </form>
      <aside className="panel resultPanel">
        <div className="panelHead"><div><h2>Valuation result</h2><p>Your estimated market value</p></div><span className="resultIcon"><IndianRupee size={19}/></span></div>
        {result ? <div className="resultContent">
          <div className="resultLabel">PREDICTED RESALE PRICE</div>
          <div className="price">{money(result.predicted_price)}</div>
          <div className="range"><span>Indicative range</span><b>{money(result.low_estimate)} – {money(result.high_estimate)}</b></div>
          <div className="rangeBar"><i/></div>
          <div className="rangeEnds"><span>Lower estimate</span><span>Higher estimate</span></div>
          <div className="successNote"><ShieldCheck size={17}/><span>Prediction generated successfully</span></div>
          <p className="disclaimer">{result.disclaimer}</p>
        </div> : <div className="empty"><div className="emptyIcon"><Gauge size={30}/></div><h3>Your estimate appears here</h3><p>Complete the vehicle details and run the prediction to see the estimated resale value.</p></div>}
        <div className="miniStats"><div><TrendingDown size={17}/><span><b>Depreciation-aware</b><small>Year & usage considered</small></span></div><div><ShieldCheck size={17}/><span><b>ML-powered</b><small>Random Forest model</small></span></div></div>
      </aside>
    </div>
    <footer><span>CarValue AI · Academic ML project</span><span>Educational estimate only · Not a dealer quote</span></footer>
  </main>;
}
