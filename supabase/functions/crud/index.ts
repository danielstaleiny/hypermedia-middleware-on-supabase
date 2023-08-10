// @ts-nocheck
import { serve } from 'https://deno.land/std/http/server.ts'
import { cors, headers, stringify } from './helpers.ts'

const main = async (req) => {
  try {
    await healthCheck(req)
    await isOptions(req)
    const xDataResource = `${req.headers.get('x-data-resource')}`
    const apikey = req.headers.get('apikey')
    const authorization = req.headers.get('authorization')
    const { name } = await getData(req)
    // TODO probably we need to sanitize the data here ???
    const it = await fetch(xDataResource, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authorization,
        'apikey': apikey,
      },
    }).then((it) => it.json())
    console.log(it)
    // const {data: data_, error} = await fetch(req.headers.get('x-data-resource'),{
    // method: req.method,
    // headers: {
    //   'Content-Type': 'application/json',
    //   'Authorization': req.headers.get('Authorization'),
    //   'apikey': req.headers.get('apikey')
    // },
    // body: stringify(body),
    // })
    //
    // const { data: data_, error } = await fetch(
    //   xDataResource,
    //   {
    //     method: 'GET',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Authorization': authorization,
    //       'apikey': apikey,
    //     },
    //   },
    // )
    // console.log(data_)
    // console.log(error)
    const data = `<p>Hey there, ${name}</p>`
    return html(data)
  } catch (err) {
    if (err instanceof Options) {
      return err.http
    }
    if (err instanceof Health) {
      return err.http
    }
    console.log(err)
  }
}

const stringify = (obj: any) => JSON.stringify(obj)

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, hx-current-url, hx-request, hx-target, x-data-resource',
}
const headers = {
  headers: { ...cors, 'Content-Type': 'application/json' },
}

// const json = (obj) => {
//   return new Response(
//     obj,
//     { headers: { 'Content-Type': 'application/json' } },
//   )
// }

const html = (obj) => {
  return new Response(
    obj,
    {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
      },
    },
  )
}

// Usefull, if we want to return early
// Mostly used for Options CORS
class Options extends Error {
  constructor() {
    super('Not an error. We abuse throw Error to return early.')
    this.name = 'CustomOptionsFunctionReturn'
  }
  get http() {
    return new Response('ok', { headers: cors })
  }
}

// Usefull, if we want to return early
// Mostly used for Helth checks
class Health extends Error {
  constructor() {
    super('Not an error. We abuse throw Error to return earlier.')
    this.name = 'CustomOptionsFunctionReturn2'
  }
  get http() {
    return new Response(stringify({ heal: 'me' }), headers)
  }
}

const getData = async (req) => {
  // First we need to figure out what headers do we have set
  let body = {}
  if (
    req.headers.has('content-type') &&
    req.headers.get('content-type').includes('application/json')
  ) {
    body = await req.json()
  } else if (
    req.headers.has('content-type') &&
    req.headers.get('content-type').includes(
      'application/x-www-form-urlencoded',
    )
  ) {
    const formData = await req.formData()
    for (const key of formData.keys()) {
      body[key] = formData.get(key)
    }
  } else if (
    // searchParams
    !req.headers.has('content-type')
  ) {
    const urlData = new URL(req.url).searchParams
    for (const key of urlData.keys()) {
      body[key] = urlData.get(key)
    }
  }
  // TODO handle multipart/form-data
  return body
}

const isOptions = async (req) => {
  if (req.method === 'OPTIONS') {
    throw new Options()
  }
  return true
}

const healthCheck = async (req) => {
  if (req.headers.get('x-health-check')) {
    throw new Health()
  }
  return true
}

serve(main)
