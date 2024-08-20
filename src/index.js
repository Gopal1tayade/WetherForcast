const monthNames = ["January", "February", "March" ,"April" , "May" , "June" ,"July" , "August" ,"Suptember" ,"October" ,"November","December" ];
  
  const date = new Date();
  
  document.getElementById("date").innerHTML = `${date.toDateString()}`;
  document.getElementById("time").innerHTML=`${date.toLocaleTimeString('en-US')}`;