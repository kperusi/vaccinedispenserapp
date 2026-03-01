import sql from '../../../lib/db'
import { NextResponse } from 'next/server'


export async function GET(req){
    const { searchParams } = new URL(req.url);
  
  // 2. Extract specific keys
  const id = searchParams.get('id');
  console.log(id)

try {
  if(id){
  const facility = await sql`
  SELECT
  u.id, u.name AS user_name ,fa.name, fa.type, fa.email, fa.id AS facility_id
  FROM users u 
  JOIN facilities fa ON u.facility_id= fa.id
  WHERE u.id=${id}
  `  
  
const facility_id=facility[0]?.facility_id
const allocations = await sql`
SELECT va.id, 
va.quantity_allocated, 
va.allocation_date, 
vt.name,
vt.manufacturer,
inv.batch_number,
inv.expiry_date,
inv.manufacturer_date,
inv.storage_condition
FROM vaccine_allocations va
JOIN inventory inv ON va.inventory_id=inv.id
JOIN vaccine_types vt ON inv.vaccine_type_id= vt.id
WHERE va.facility_id=${facility_id}`

// console.log(allocations)
  return NextResponse.json([{facility:facility[0]},{allocations:allocations},{status:201}])
  }



return NextResponse.json([{error:'i do'},{status:401}])

} catch (error) {
     console.error("Get user facility error", error);
    return NextResponse.json([
      { error: "Failed to fetch user Facility" },
      { status: 500 },]
    );
}
}