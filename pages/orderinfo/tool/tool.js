// count Integral
function CountIntegral(array) {
  var count = 0
  for(var k in array){
  //  console.log(array[k]);
    if (typeof array[k].payment == "number"){
      count += array[k].payment
    }
    if (typeof array[k].payment == "string") {
      count += parseInt(array[k].payment)
    }
  }
  count = parseInt(count / 100);
  return count
}

module.exports={
  CountIntegral: CountIntegral,
}