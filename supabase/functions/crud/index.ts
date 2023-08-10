// @ts-nocheck
import { serve } from 'https://deno.land/std/http/server.ts'
import { cors, headers, stringify } from './helpers.ts'

const main = async (req) => {
  try {
    await healthCheck(req)
    await isOptions(req)

    const { name } = await req.json()
    const data = {
      message: `Hello ${name}!`,
    }

    return new Response(
      JSON.stringify(data),
      { headers: { 'Content-Type': 'application/json' } },
    )
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
    'authorization, x-client-info, apikey, content-type',
}
const headers = {
  headers: { ...cors, 'Content-Type': 'application/json' },
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
