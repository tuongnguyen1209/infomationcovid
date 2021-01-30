let domain = 'https://api.covid19api.com/';
let apis = {
    'getCountry': `${domain}countries`,
    'getSummary': `${domain}summary`,
    'getDate':`${domain}live/country/`
}
export let getCountry = async () => {
    let a = await fetch(apis['getCountry'])
    return await a.json()
}
export let getSummary=async ()=>{
    let a=await fetch(apis['getSummary'])
    return await a.json()
}
export let getByDate=async (country,from)=>{
    
    let a =await fetch(`${apis['getDate']}${country}/status/confirm/date/${from}`)
    return await a.json();
}
