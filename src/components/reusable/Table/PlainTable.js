import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
const data = [
 {
  product: 'CURD 500 ML',
  quantity: 300,
  unit: 'ML'
},
{
  product: 'TONED MILK 500 ML',
  quantity: 1200,
  unit: 'ML'
},
{
  product: 'TONED MILK 1 LTR',
  quantity: 800,
  unit: 'LTR'
},
{
  product: 'GHEE 1 LTR',
  quantity: 150,
  unit: 'LTR'
},
{
  product: 'GHEE 500 ML',
  quantity: 250,
  unit: 'ML'
},
{
  product: 'PANEER 200 GRAMS',
  quantity: 400,
  unit: 'GRAMS'
},
{
  product: 'PANEER 500 GRAMS',
  quantity: 180,
  unit: 'GRAMS'
},
{
  product: 'BUTTER 100 GRAMS',
  quantity: 350,
  unit: 'GRAMS'
},
{
  product: 'BUTTER 500 GRAMS',
  quantity: 90,
  unit: 'GRAMS'
},
{
  product: 'FLAVOURED MILK BADAM',
  quantity: 600,
  unit: 'ML'
},
{
  product: 'FLAVOURED MILK STRAWBERRY',
  quantity: 450,
  unit: 'ML'
},
{
  product: 'FLAVOURED MILK CHOCOLATE',
  quantity: 700,
  unit: 'ML'
},
{
  product: 'LASSI SWEET 200 ML',
  quantity: 550,
  unit: 'ML'
},
{
  product: 'LASSI MASALA 200 ML',
  quantity: 520,
  unit: 'ML'
},
{
  product: 'DAHI 200 GRAMS',
  quantity: 480,
  unit: 'GRAMS'
}


]
const tableHeaders = [{accessorKey:'product',title:'Product Name'},{accessorKey:'quantity',title:'Quantity'},{accessorKey:'unit',title:'Unit'}]

function PlainTable() {
  return (
    <ScrollArea className='h-110'>
    <Table>
      <TableHeader className="sticky top-0 z-10 bg-white">
        <TableRow>
          {tableHeaders.map((item,index)=><TableHead key={index}>{item.title}</TableHead>)}
        </TableRow>
      </TableHeader>
      <TableBody className='mt-2'>
        {data.map((item,index)=>{
          return (<TableRow key={index}>
            {tableHeaders.map((col,index)=>{
              return <TableCell key={col.accessorKey}>{item[col.accessorKey]}</TableCell>
            })}
          </TableRow>)
        })}
          {/* {data.map((item) => (
            <TableRow key={item.product}>
              <TableCell>{item.product}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>{item.unit}</TableCell>
            </TableRow>
          ))} */}
      </TableBody>
    </Table>
    </ScrollArea>
  )
}
export default PlainTable
