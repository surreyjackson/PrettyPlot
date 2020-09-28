



//counties is the array of data
//target is the selection of the g element to place the graph in
//xscale,yscale are the x and y scales.
var drawPlot = function(counties,target,
                         xScale,yScale)
{
    target
    .selectAll("circle")
    .data(counties)
    .enter()
    .append("circle")
    .attr("cx",function(county)
    {
        return xScale(county.white_pct);   
    })
    .attr("cy",function(county)
    {
        return yScale(county.trumpPercentage);    
    })
    .attr("r",2.5)
    .attr("class",function(county)
    {
        if(county.lesscollege_pct<80)
        {
            return "lessCollege"        
        }
        else if(county.clf_unemploy_pct<6)
        {
            return "unemployment";        
        }
    })//tooltip on
    .on("mouseenter" ,function(county)
      {
        
      var xPos = d3.event.pageX;
      var yPos = d3.event.pageY;
      
        d3.select("#tooltip")
        .classed("hidden",false)
        .style("top",yPos+"px")
        .style("left",xPos+"px")
        
        d3.select("#state")
        .text(county.state);
        
        d3.select("#county")
        .text(county.county);
      })//tool tip off
    .on("mouseleave",function()
    {
        d3.select("#tooltip")    
        .classed("hidden",true);
    })
}


var makeTranslateString = function(x,y)
{
    return "translate("+x+","+y+")";
}


//graphDim is an object that describes the width and height of the graph area.
//margins is an object that describes the space around the graph
//xScale and yScale are the scales for the x and y scale.
var drawAxes = function(graphDim,margins,
                         xScale,yScale)
{
   var xAxis = d3.axisBottom().scale(xScale);
   d3.select("svg").append("g").attr("class","axis").attr("transform","translate(50,550)").call(xAxis);
    
   var yAxis = d3.axisLeft().scale(yScale);
   d3.select("svg").append("g").attr("class","axis").attr("transform","translate(50,50)").call(yAxis);
}


//graphDim -object that stores dimensions of the graph area
//margins - objedct that stores the size of the margins
var drawLabels = function(graphDim,margins)
{
    var y = d3.select("svg")
  .append("g")
    .attr("transform","translate(10,200)")

  y.append("text")
    .text("Percentage Voting for Trump")
    .attr("transform","rotate(90)")
    .classed("label",true)
    
    var x = d3.select("svg")
  .append("g")
    .attr("transform","translate(360,600)")
    .classed("label",true)

  x.append("text")
    .text("Percent White")
    
    var title = d3.select("svg")
  .append("g")
    .attr("transform","translate(300,30)")
    .classed("title",true)

  title.append("text")
    .text("Trump Support")
}


var drawLegend = function(graphDim,margins)
{
    
 
   var categories = [
       {
           class:"lessCollege",
           name:"Less College"
       },
       {
           class:"unemployment",
           name:"High unemployment"
       }
    ]
   d3.select("svg").append("circle").attr("cx",670)
    .attr("cy",100)
    .attr("r",4)
    .attr("class","lessCollege")
    
   d3.select("svg").append("circle").attr("cx",670)
    .attr("cy",120)
    .attr("r",4)
    .attr("class","unemployment")

    var college = d3.select("svg")
  .append("g")
    .attr("transform","translate(680,105)")
    .style('fill','red')
    .style('font-size','13px')

  college.append("text")
    .text("Less College")
    
    var unemployment = d3.select("svg")
  .append("g")
    .attr("transform","translate(680,125)")
    .style('fill','blue')
    .style('font-size','13px')

  unemployment.append("text")
    .text("High Unemployment")
    
    
}

//sets up several important variables and calls the functions for the visualization.
var initGraph = function(counties)
{
    //size of screen
    var screen = {width:800,height:600}
    //how much space on each side
    var margins = {left:50,right:150,top:50,bottom:50}
    
    
    
    var graph = 
        {
            width:screen.width-margins.left-margins.right,
            height:screen.height - margins.top-margins.bottom
        }
    console.log(graph);
    
    d3.select("svg")
    .attr("width",screen.width)
    .attr("height",screen.height)
    
    var target = d3.select("svg")
    .append("g")
    .attr("id","#graph")
    .attr("transform",
          "translate("+margins.left+","+
                        margins.top+")");
    
    
    var xScale = d3.scaleLinear()
        .domain([0,100])
        .range([0,graph.width])

    var yScale = d3.scaleLinear()
        .domain([0,1])
        .range([graph.height,0])
    
    drawAxes(graph,margins,xScale,yScale);
    drawPlot(counties,target,xScale,yScale);
    drawLabels(graph,margins);
    drawLegend(graph,margins);
    
    
    
    
    
}




var successFCN = function(counties)
{
    console.log("politics",counties);
    initGraph(counties);
}

var failFCN = function(error)
{
    console.log("error",error);
}

var polPromise = d3.csv("data/politics.csv")
polPromise.then(successFCN,failFCN);