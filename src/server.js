import Fastify from 'fastify'
import fastifyStatic from '@fastify/static'
import fetch from 'node-fetch'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const fastify = Fastify({
  logger: true
})

fastify.register(fastifyStatic, {
  root: join(__dirname, '../public'),
})

fastify.get('/', function (request, reply) {
  return reply.sendFile('index.html')
})

fastify.get('/search', async function (request, reply) {
  try {
    const { q } = request.query;
    const API_ID = process.env.API_ID;
    const API_KEY = process.env.API_KEY;
    const url = `https://api.edamam.com/search?q=${encodeURIComponent(q)}&app_id=${API_ID}&app_key=${API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Failed to fetch recipes');
    }

    const data = await response.json();
    const recipes = data.hits.map(hit => hit.recipe);

    return recipes;
  } catch (error) {
    console.error('Error fetching recipes:', error);

    return reply.code(500).send('Error fetching recipes');
  }
})

fastify.listen({ port: 3000 }, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  console.log(`Server is now listening on ${address}`)
})