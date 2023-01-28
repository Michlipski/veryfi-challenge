import Client from '@veryfi/veryfi-sdk'
import { NextApiResponse, NextApiRequest } from 'next'

export default async function processReceiptHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { query: { path } } = req

  const clientId = process.env.CLIENT_ID
  const clientSecret = process.env.CLIENT_SECRET
  const username = process.env.USERNAME
  const apiKey = process.env.API_KEY

  const categories = ['Grocery', 'Utilities', 'Travel']
  let veryfiClient = new Client(clientId, clientSecret, username, apiKey)
  let response = await veryfiClient.process_document(path, categories)
  const lineItems = response?.line_items

  // User with id exists
  return lineItems
    ? res.status(200).json({ message: JSON.stringify(lineItems) })
    : res.status(500).json({ message: `Receipt could not be processed` })
}