import sql from '../../../../lib/db'
import { NextResponse } from 'next/server'


export async function GET(req,{params}){
    // const { searchParams } = new URL(req.url);
  
  // 2. Extract specific keys
  const {id} = await params;
  console.log(id)

try {
  if(id){
  const requests= await sql`
  SELECT 
  vr.id, 
  vr.quantity_requested,
  vr.request_notes,
  vr.status,
  vt.name,
  FROM vaccine_requests vr
  JOIN vaccine_types vt ON vr.vaccine_id = vt.id
  WHERE vr.facility_id=${id}
  `
  

// console.log(allocations)
  return NextResponse.json(requests,{status:201})
  }



return NextResponse.json([{error:'i do'},{status:401}])

} catch (error) {
     console.error("Get user requests error", error);
    return NextResponse.json([
      { error: "Failed to fetch user requests" },
      { status: 500 },]
    );
}
}