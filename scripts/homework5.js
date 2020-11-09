
var mapSvg;

var lineSvg;
var lineWidth;
var lineHeight;
var lineInnerHeight;
var lineInnerWidth;
var tpadding = {
  x: 50,
  y: 20
};

var lineMargin = { top: 20, right: 60, bottom: 60, left: 100 };

var dogsData = {};
var flightsData = {};

// This runs when the page is loaded
document.addEventListener('DOMContentLoaded', function() {
  
  // Load both files before doing anything else
  Promise.all([d3.csv('data/dogs.csv'),
               d3.csv('data/flights.csv')
              ])
          .then(function(values){
    
      dogsData = values[0];
      flightsData = values[1];

      console.log(dogsData,flightsData);
      drawMap();

  });
});


function prepareData(){

  var x1 = 100,x2=700,y1=30,y2=30;

  var tdogs = [];

  var texts = [];
  var lines = [];
  for(var i=1951;i<1967;i++){

    // svg.append("text")
    //   .attr("class", "year_text")
    //   .attr("text-anchor", "end")
    //   .attr("x", x1-5)
    //   .attr("y", y1)
    //   .text(i)
    //   .attr("opacity","0.9")
    //   .attr("font-size", "10px")
    //   .attr("fill", "gray");

    texts.push({'x':x1-20,'y':y1+5,'year':i})

    var flight_vals = flightsData.filter(function(d){ 
      return +d.Year == i;  
    });

    var x1j=x1+30,x2j,y1j=y1,y2j;

    

    for(var j=0;j<flight_vals.length;j++){
      var dogNames = flight_vals[j].Dogs;
      var dogSplit = dogNames.split(',');

      var dogstatus = flight_vals[j].dogStatus;
      dogstatus = dogstatus.split(',');
      if(dogSplit.length == 2){

          var dog1 = dogsData.filter(function(d){ 
              return d.Name_latin == dogSplit[0];  
          });
          var dog2 = dogsData.filter(function(d){ 
              return d.Name_latin == dogSplit[1];  
          })

          // svg.append('circle')
          // .attr("id", dog1[0].Index)
          // .attr('cx', x1j)
          // .attr('cy', y1j)
          // .attr('r', 10)
          // .attr('stroke', 'black')
          // .attr('fill', '#69a3b2')
          // .on('mouseover', function(d, i) {
          // })
          // .on('mouseout', function(d, i) {
            
          // });

          tdogs.push({'x':x1j,'y':y1j,'year':flight_vals[j].Year,'status':dogstatus[0],
            'name':dog1[0].Name_latin,'rocket':flight_vals[j].Rocket,'altitude':flight_vals[j].Altitude,
          'eng':dog1[0].Name_eng,'fate':dog1[0].Fate,'gender':dog1[0].Gender,'cy':dog1[0].Name_cy,
            'notes':dog1[0].Notes,'count':dog1[0].count,'result':flight_vals[j].Result});

          x1j += 30;

          // svg.append('circle')
          // .attr('cx', x1j)
          // .attr('cy', y1j)
          // .attr('r', 10)
          // .attr('stroke', 'black')
          // .attr('fill', '#69a3b2');

          tdogs.push({'x':x1j,'y':y1j,'year':flight_vals[j].Year,'status':dogstatus[1],
            'name':dog2[0].Name_latin,'rocket':flight_vals[j].Rocket,'altitude':flight_vals[j].Altitude,
          'eng':dog2[0].Name_eng,'fate':dog2[0].Fate,'gender':dog2[0].Gender,'cy':dog2[0].Name_cy,
            'notes':dog2[0].Notes,'count':dog2[0].count,'result':flight_vals[j].Result});

          // svg.append('line')
          // .attr('x1', x1j-30+5)
          // .attr('y1', y1j)
          // .attr('x2', x1j-5)
          // .attr('y2', y1j)
          // .attr('stroke', 'gray');

          lines.push({'x1':x1j-30+5,'x2':x1j-5,'y1':y1j,'y2':y1j})

      }
      else if(dogSplit.length == 1){
        // svg.append('circle')
        //   .attr('cx', x1j)
        //   .attr('cy', y1j)
        //   .attr('r', 10)
        //   .attr('stroke', 'black')
        //   .attr('fill', '#black');

          var dog1 = dogsData.filter(function(d){ 
              return d.Name_latin == dogSplit[0];  
          });
       
        tdogs.push({'x':x1j,'y':y1j,'year':flight_vals[j].Year,'status':dogstatus[0],
            'name':dog1[0].Name_latin,'rocket':flight_vals[j].Rocket,'altitude':flight_vals[j].Altitude,
            'eng':dog1[0].Name_eng,'fate':dog1[0].Fate,'gender':dog1[0].Gender,'cy':dog1[0].Name_cy,
            'notes':dog1[0].Notes,'count':dog1[0].count,'result':flight_vals[j].Result});

      }

      x1j += 30;

    }
    y1 = y1+30;
    y2 = y1;
  }
  //console.log(tdogs,texts,lines);
  return [tdogs,texts,lines];

}


function drawMap(){
  var tooltip = d3.select("div.tooltip");

  var canvas_width = 1000;
  var canvas_height = 700;
  var padding =  100;


  var svg = d3.select("#map")  // This is where we put our vis
      .attr("width", canvas_width)
      .attr("height", canvas_height);

  svg.selectAll('*').remove();


  var fdata = prepareData();

  tdogs = fdata[0];
  ttexts = fdata[1];
  tlines = fdata[2];
  
  console.log(tdogs,ttexts,tlines);
  
  svg.append("g").selectAll("circle")
  .data(tdogs,d=>d.name)
  .enter()
  .append("circle")
  .attr("id",function(d){
     var tname = d.name;
      if(tname.includes('/')){
        tname =  (tname.split('/')[0]).trim()
      }
      return tname;
  })
  .attr("cx",function(d){
      return d.x;
  })
  .attr("cy",function(d){
    return d.y;
  })
  .attr("r",function(d){
      return 10;
  })
  .style("fill", function(d){
    if(d.status == 'dead'){
      return '#CC79A7';
    }
    else{
      return '#E69F00';
    }
  })
  .attr("stroke", "white")
  .attr("stroke-width",3)
  // .text(function(d){
  //   return country_geos(d[2]);
  // })
  .on('mouseover', function (d, i) {
      var tname = d.name;
      if(tname.includes('/')){
        tname =  (tname.split('/')[0]).trim()
      }

    d3.select('#tooltip').transition().duration(200).style('opacity', 1).text(d.name);

    d3.selectAll("#"+tname)
    .transition()
    .attr("stroke", "#64DCF4")
    .attr("stroke-width",3);
    
    d3.select(this).transition()
         .duration('100')
         .attr("r", 15)
         .attr("stroke", "#64DCF4")
         .attr("stroke-width",3);

  })
  .on("mousemove", function(d, i){
   
    tooltip.classed("hidden", false)
      .style("top", (d3.event.pageY + -30) + "px")
      .style("left", (d3.event.pageX + 20) + "px")
      .html("Dog Name in (Latin): <strong>" + d.name + "</strong>"+

        "<br>Dog Name in (English): <strong>" + d.eng + "</strong>"+
        "<br>Dog Name in (cy): <strong>" + d.cy + "</strong>"+
        "<br>Rocket Name: <strong>" + d.rocket + "</strong>"+
        "<br>Dog Status: <strong>" + d.status + "</strong>"+
        "<br>Dog Gender: <strong>" + d.gender + "</strong>"+
        "<br>Dog Fate: <strong>" + d.fate + "</strong>"+
        "<br>No Times Travelled in Flight: <strong>" + d.count + "</strong>"
      );

    d3.selectAll("#rocket")
    .attr('x',800)
    .attr('y',550)
    .attr("xlink:href", "./../images/space.png");

    // d3.selectAll("#rocketText").remove();
    d3.selectAll("#rocket_high").remove();
    d3.selectAll("#rocket_low").remove();
    d3.selectAll("#rocket_line").remove();

  })
  .on('mouseout', function (d, i) {
      var tname = d.name;
      if(tname.includes('/')){
        tname =  (tname.split('/')[0]).trim()
      }
      
      tooltip.classed("hidden", true);

      d3.selectAll("#"+tname)
      .transition()
      .attr("stroke", "white")
      .attr("stroke-width",3);

    d3.select(this).transition()
          .duration('200')
          .attr("r", 10)
          .attr("stroke", "white")
          .attr("stroke-width",3);

    d3.selectAll("#rocket")
    .attr('x',800)
    .attr('y',550)
    .attr("xlink:href", "./../images/space.png")
    
    // d3.selectAll("#rocketText").remove();
    d3.selectAll("#rocket_high").remove();
    d3.selectAll("#rocket_low").remove();
    d3.selectAll("#rocket_line").remove();
  })
  .on('click', function(d,i) {
    
    
    var dt = parseInt(d.altitude);
    var al = dt;
    if(dt == 1000){
          dt = 550 - dt/2;
          al = "Travelled till orbit";
        }
        else{
          dt = 550 - dt;
          
        }

    svg.append("text")
      .attr('id','rocket_high')
      .attr("text-anchor", "center")
      .attr("x", 650)
      .attr("y", dt-10)
      .text(function(){
        return "Max Altitude: " + al;
      })
      .attr("opacity","1.0")
      .attr("font-size", "15px")
      .attr("fill", "white");

    svg.append('line')
          .attr('id','rocket_line')
          .attr('x1', 650)
          .attr('y1', dt)
          .attr('x2', 650)
          .attr('y2', 600)
          .attr('stroke', 'white')
          .style("stroke-width", 3);

    svg.append("text")
      .attr('id','rocket_low')
      .attr("text-anchor", "center")
      .attr("x", 650)
      .attr("y", 600+10)
      .text(function(){
        return "Min Altitude: " + 0;
      })
      .attr("opacity","1.0")
      .attr("font-size", "15px")
      .attr("fill", "white");


    console.log(d.status);
      d3.selectAll("#rocket")
      .transition()
      .duration(1500)
      .attr('x',800)
      .attr('y',function(){
        console.log("add", dt);
        return dt;
      })
      .transition()
      .duration(1500)
      .attr("xlink:href",function(){
        console.log("dasd", d.status);
        if(d.status == "alive"){
          return "./../images/rocket_cloud.png";
        }
        else{
          return "./../images/blast_image.jpg";
        }
      })
      .transition()
      .duration(1500)
      .attr('x',800)
      .attr('y',550)
      .attr("xlink:href", "./../images/space.png");

      

      // svg.append("text")
      // .attr("id", "rocketText")
      // .attr("text-anchor", "center")
      // .attr("x", 810)
      // .attr("y", dt)
      // .text(function(){
      //   if( parseInt(d.altitude) == 1000){
      //       return "Maximum Height Travelled up to orbit";
      //   }
      //   else
      //   return "Maximum Height Travelled: " + d.altitude
      // })
      // .attr("opacity","1.0")
      // .attr("font-size", "15px")
      // .attr("fill", "white");

  });


  svg.selectAll(".foo")
  .data(ttexts,d=>d.year)
  .enter()
  .append("text")
  .text(d=>d.year)
  .attr("class", "foo")
  .attr("x", d=>d.x)
  .attr("y", d=>d.y)
  .attr("opacity","0.9")
  .attr("font-size", "10px")
  .attr("fill", "white");

  // svg.append('line')
          // .attr('x1', x1j-30+5)
          // .attr('y1', y1j)
          // .attr('x2', x1j-5)
          // .attr('y2', y1j)
          // .attr('stroke', 'gray');

  svg.selectAll(".lines")
  .data(tlines,d=>d.x1)
  .enter()
  .append("line")
  .attr("class", "lines")
  .attr('x1', d=>d.x1)
  .attr('y1', d=>d.y1)
  .attr('x2', d=>d.x2)
  .attr('y2', d=>d.y2)
  .attr('stroke', 'white')
  .style("stroke-width", 3);


  var img = svg.append("svg:image")
    .attr('id','rocket')
    .attr("xlink:href", "./../images/space.png")
    .attr("width", 80)
    .attr("height", 80)
    .attr("x", 800)
    .attr("y",550);

  svg.append("text")
      .attr("id", "color6")
      .attr("text-anchor", "center")
      .attr("x", 800)
      .attr("y", 640)
      .text(function(){
          return "Rocket Launcher";
      })
      .attr("opacity","1.0")
      .attr("font-size", "12px")
      .attr("fill", "white");

  svg.append('circle')
          .attr('cx', 100)
          .attr('cy', 520)
          .attr('r', 10)
          .attr('fill', '#CC79A7')
          .attr('stroke', 'white')
          .attr("stroke-width",3);
         

  svg.append("text")
      .attr("id", "color1")
      .attr("text-anchor", "left")
      .attr("x", 120)
      .attr("y", 520)
      .text(function(){
          return "Dog is dead";
      })
      .attr("opacity","1.0")
      .attr("font-size", "12px")
      .attr("fill", "white");

  svg.append('circle')
          .attr('cx', 100)
          .attr('cy', 550)
          .attr('r', 10)
          .attr('fill', '#E69F00')
          .attr('stroke', 'white')
          .attr("stroke-width",3);

  svg.append("text")
      .attr("id", "color2")
      .attr("text-anchor", "left")
      .attr("x", 120)
      .attr("y", 550)
      .text(function(){
          return  "Dog is alive";
      })
      .attr("opacity","1.0")
      .attr("font-size", "12px")
      .attr("fill", "white");


  svg.append('circle')
          .attr('cx', 100)
          .attr('cy', 580)
          .attr('r', 10)
          .attr('fill', 'white')
          .attr('stroke', '#64DCF4')
          .attr("stroke-width",3);

  svg.append("text")
      .attr("id", "color3")
      .attr("text-anchor", "left")
      .attr("x", 120)
      .attr("y", 580)
      .text(function(){
          return  "Highlights the a dog that travelled on rockets from all years";
      })
      .attr("opacity","1.0")
      .attr("font-size", "12px")
      .attr("fill", "white");

  svg.append("text")
      .attr("id", "color4")
      .attr("text-anchor", "left")
      .attr("x", 100)
      .attr("y", 610)
      .text(function(){
          return  "On each circle mouse hover, dog information will be shown.";
      })
      .attr("opacity","1.0")
      .attr("font-size", "12px")
      .attr("fill", "white");

  svg.append("text")
      .attr("id", "color4")
      .attr("text-anchor", "left")
      .attr("x", 100)
      .attr("y", 630)
      .text(function(){
          return  "On each circle click, the rocket launches and moves to it's certain Altitude.";
      })
      .attr("opacity","1.0")
      .attr("font-size", "12px")
      .attr("fill", "white");

  svg.append("text")
      .attr("id", "color4")
      .attr("text-anchor", "left")
      .attr("x", 100)
      .attr("y", 650)
      .text(function(){
          return  "The line between two circles represents the both dogs have travelled in same rocket.";
      })
      .attr("opacity","1.0")
      .attr("font-size", "12px")
      .attr("fill", "white");

}