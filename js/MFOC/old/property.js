
var showProperty = function(object_arr, div_id){
  document.getElementById(div_id).innerHTML = '';

  //if put empty array.
  if (object_arr == undefined || object_arr.length == 0){
    return;
  }

  var min_max_date = findMinMaxTimeAndValue(object_arr);
  var svg = d3.select("#"+div_id).append("svg");
  svg.attr("width",$(window).width());
  svg.attr("height",$(window).height() / 5);
  var margin = {top: 10, right: 20, bottom: 10, left: 50},
  width = $(window).width() - margin.left - margin.right,
  height = $(window).height() /5 - margin.top - margin.bottom;

  var g = svg.append("g")
        .attr("transform", "translate("+ margin.left +"," + 0 + " )");

  var x = d3.scaleTime()
  .rangeRound([0, width]);
  LOG(height);
  var y = d3.scaleLinear()
  .rangeRound([height, 0]);

  var line = d3.line()
  .x(function(d) { return x(d.date)})
  .y(function(d) { return y(d.value)});


  x.domain(min_max_date.date);
  y.domain(min_max_date.value);

  console.log(min_max_date);

  g.append("g")
  .attr("transform" , "translate(0,"+height+")")
  .call(d3.axisBottom(x))
  .select(".domain")
  .remove();

  g.append("g")
  .call(d3.axisLeft(y))
  .append("text")
  .attr("fill", "#000")
  .attr("transform", "rotate(-90)")
  .attr("y", 6)
  .attr("dy", "0.71em")
  .attr("text-anchor", "end")
  .text(object_arr[0].name+"("+object_arr[0].uom+")");

  var graph_data = [];
  for (var id = 0 ; id < object_arr.length ; id++){
    var data = [];
    var object = object_arr[id];
    for (var i = 0 ; i < object.datetimes.length ; i++){
      var comp = {};
      var da = new Date(object.datetimes[i]).toISOString();

      comp.date = new Date(object.datetimes[i]);//dateparse(da);
      comp.value = object.values[i];
      console.log(comp);
      data.push(comp);
    }

    if (object.interpolations == 'Spline'){
      line.curve(d3.curveCardinal);
    }
    else if (object.interpolations == 'Stepwise'){
      line.curve(d3.curveStepAfter)
    }

    var r_color = d3.rgb(Math.random() *255,Math.random() *255,0);

    graph_data.push(data);
    if(object.interpolations == 'Discrete'){
      for (var i = 0 ; i < data.length ; i++){
        g.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function(d,i) { return x(d.date); } )
        .attr("cy", function(d,i) { return y(d.value); } )
        .attr("r", 5);
      }
    }
    else{
      g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", r_color)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1.5)
      .attr("d", line);
    }

  }
  svg.on("click", function () {
    var coords = d3.mouse(this);
    var formatDate = d3.timeFormat("%Y-%m-%d %H:%M:%S");

    var isodate = formatDate(x.invert(coords[0]));
    viewer.clock.currentTime=Cesium.JulianDate.fromDate(new Date(isodate));
    viewer.clock.shouldAnimate = false;
  });

}



function findMinMaxTimeAndValue(pro_arr){

  var first_date = new Date(pro_arr[0].datetimes[0]);
  var first_value = pro_arr[0].values[0];
  var min_max = {};
  min_max.date = [first_date,first_date];
  min_max.value = [first_value,first_value];
  for (var i = 0 ; i < pro_arr.length ; i++){
    var temp_max_min = findMinMaxTime(pro_arr[i].datetimes);
    if (temp_max_min[0].getTime() < min_max.date[0].getTime()){
      min_max.date[0] = temp_max_min[0];
    }
    if (temp_max_min[1].getTime() > min_max.date[1].getTime()){
      min_max.date[1] = temp_max_min[1];
    }
    for (var j = 0 ; j < pro_arr[i].values.length ; j++){
      if (min_max.value[0] > pro_arr[i].values[j]){
        min_max.value[0] = pro_arr[i].values[j];
      }
      if (min_max.value[1] < pro_arr[i].values[j]){
        min_max.value[1] = pro_arr[i].values[j];
      }
    }

  }
  return min_max;
}
