import express from 'express'
import ViteExpress from 'vite-express'
import xml2js from 'xml2js'
import fs from 'fs'

const app = express()

const extractUsefulFields = (entry) => {
  let retVal = {}
  retVal.min_alder = +entry['f:min_alder'][0]
  retVal.maks_alder = +entry['f:maks_alder'][0]
  retVal.min_belop = +entry['f:min_belop'][0]
  retVal.maks_belop = +entry['f:maks_belop'][0]
  retVal.pensjonist = entry['f:pensjonist'][0] === "true"
  retVal.student = entry['f:student'][0] === "true"
  retVal.navn = entry['f:navn'][0]
  retVal.id = entry['id'][0]
  retVal.href = entry['link'][0].$.href
  retVal.leverandor = entry['f:leverandor_tekst'][0]
  retVal.produktpakke_tekst = entry['f:produktpakke_tekst'][0]
  retVal.markedsomraade = entry['f:markedsomraade'][0]
  retVal.markedsomraadeTekst = entry['f:markedsomraadeTekst'][0]
  retVal.spesielle_betingelser = entry['f:spesielle_betingelser'][0]

  return retVal
}

const readFileAndParseXML = async (filename) => {
  const file = fs.readFileSync(filename)
  return xml2js.parseStringPromise(file)
  .then(json => json.feed.entry.map(e => extractUsefulFields(e)))
}

app.get('/data', async (_, res) => {
  res.send(await readFileAndParseXML("./src/assets/banksparing.xml"))
})

ViteExpress.listen(app, 3000, () => console.log("server is listening on port 3000"))
