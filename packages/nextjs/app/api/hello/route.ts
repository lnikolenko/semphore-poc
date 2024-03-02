import { NextResponse } from 'next/server'
 
export async function GET(request: Request) {
  return NextResponse.json({ msg: 'Hello from server' })
}

 
export async function POST(request: Request) {
    const postData = await request.json()
    return NextResponse.json({ msg: 'Hello from server' + postData.name })
}