import { useState, useEffect } from 'react'
import './App.css'
import getData from './api/getData'

type Country = {
  isoCode: string;
  name: string;
}

type CountryApi = {
  isoCode: string;
  name: { language: string; text: string }[];
}

type Holiday = {
  holidayName: string;
  date: string;
}

type HolidayApi = {
  name: { language: string; text: string }[];
  startDate: string;
}

const formatter = new Intl.DateTimeFormat('en-US', {
   month: 'long', day: 'numeric' })


function App() {

  const [countries, setCountries] = useState<Country[]>([]);
  const [isoCode, setIsoCode] = useState('NL');  
  const [holidays, setHolidays] = useState<Holiday[] >([]);
  const [loading, setLoading] = useState(false);

  const MAIN_URL = 'https://openholidaysapi.org/'

  useEffect(() => {
    async function getCountries(){
      try{
        const data: CountryApi[] = await getData(`${MAIN_URL}Countries`)
        if (!data) return;
        console.log(data)
        const countries = data.map((item)=>{
          const country = item.name.find((item)=> item.language === 'EN')
          return {
            name: country ? country.text : '',
            isoCode: item.isoCode,
          }
        })
        setCountries(countries)
        console.log(countries) 
      }
      catch(e:unknown){
        console.log("Error has occured", e)
      }
    }
    getCountries()
  }, [])


  useEffect(()=>{

    const controller = new AbortController()
    const signal = controller.signal


    async function getHolidays(){

      if (!isoCode ) return;
      try{
        setLoading(true)
        const currentYear = new Date().getFullYear()
        const validFrom = `${currentYear}-01-01`
        const validTo = `${currentYear}-12-31`

        const holidaysData: HolidayApi[] = await getData(`${MAIN_URL}PublicHolidays?countryIsoCode=${isoCode}&validFrom=${validFrom}&validTo=${validTo}`, { signal })
        console.log(holidaysData)
        const holiday = holidaysData.map((item)=>{
          const holidayName = item.name.find((holiday)=> holiday.language === 'EN')
          return {
            holidayName: holidayName ? holidayName.text : '',
            date: item.startDate,
          }
           
      })
        setHolidays(holiday)
        console.log(holiday)
      }
      catch(e:unknown){
        if (e instanceof DOMException && e.name === "AbortError"){
            console.log("Request aborted");
        } else {
            console.log("Error in loading holidays", e);
        } 
      }
      finally{
        setLoading(false)
      }
     }  getHolidays()
        return () => controller.abort()      
},  [isoCode])

const upcomingHoliday = holidays.find((holiday)=>new Date(holiday.date) >= new Date())
console.log(upcomingHoliday)



  return (
    <div className="app">
      <div className="panel">
        <h2 className="title">Holiday Explorer</h2>
        <div className='selectors'>
            <label>
              Select Country:
              <select className="select" value={isoCode} onChange={(e)=> setIsoCode(e.target.value)}>
                {countries.map((country)=> (
                  <option key={country.isoCode} value={country.isoCode}>
                    {country.name}
                  </option>
                ))}
              </select>
            </label>
        </div>
      </div>
      <div className='result'>
          {loading && <p>Loading holidays...</p>}
          {holidays.length === 0 && <p>No holidays found for the selected country.</p>}
          {holidays.length >0 && (
            <>
              <strong>Publick Holidays</strong> of <p>{countries.find((c)=> c.isoCode === isoCode)?.name}</p>
              <div className = 'upcoming-holidays'>
                <p><strong>Next Holiday</strong></p>
                <p><strong>
                  { upcomingHoliday
                    ?`${upcomingHoliday.holidayName} on ${formatter.format(new Date(upcomingHoliday?.date))}`
                    : 'No upcoming holidays this year'}
                   </strong></p>
              </div>
              <ul className='holidays-list'>
                {holidays.map((holiday, i)=> (
                  <li key={i} className='holiday-card'>
                    <strong>{holiday.holidayName}</strong>
                    <p>{formatter.format(new Date(holiday.date))}</p>
                  </li>
                ))}
              </ul>
            </>            
          )}
      </div>
    </div>
      
    
  )
}

export default App
