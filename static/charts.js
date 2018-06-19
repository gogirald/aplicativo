var fechasChart = dc.barChart("#fechas"),
  potenciasChart = dc.compositeChart("#potencias"),
  voltajesChart = dc.compositeChart("#voltajes"),
  corrientesChart = dc.compositeChart("#corrientes"),
  eActivaChart = dc.rowChart("#eActiva"),
  eInductivaChart = dc.rowChart("#eInductiva"),
  eCapacitivaChart = dc.rowChart("#eCapacitiva"),
  consumoIndi = dc.numberDisplay("#kWh");

  visCount = dc.dataCount(".dc-data-count");


d3.json("/energia/monitoreo", function(err, data) {
  if (err) throw err;

  console.log(data);

  data.forEach(function (d) {
    d["estampa tiempo"]["$date"] = new Date(d["estampa tiempo"]["$date"]);
  });

  var ndx = crossfilter(data);
  var all = ndx.groupAll();

//      var frecuenciaDim = ndx.dimension(function (d){return d["frecuencia"];});

//      var vL1Dim = ndx.dimension(function (d){return d["voltaje L1"];});
//      var vL2Dim = ndx.dimension(function (d){return d["voltaje L2"];});
//      var vL3Dim = ndx.dimension(function (d){return d["voltaje L3"];});
//      var potenciaActDim = ndx.dimension(function (d){return d["potencia Activa Total"];});
//      var potenciaReaDim = ndx.dimension(function (d){return d["potencia reactiva Total"];});
//      var potenciaApaDim = ndx.dimension(function (d){return d["potencia aparente Total"];});
  var iL1Dim = ndx.dimension(function (d){return d["corriente L1"];});
  var iL2Dim = ndx.dimension(function (d){return d["coriente L2"];});
  var iL3Dim = ndx.dimension(function (d){return d["corriente L3"];});

  var eActivaDim = ndx.dimension(function (d){return d["energia activa"];});
  var eInductivaDim = ndx.dimension(function (d){return d["energia inductiva"];});
  var eCapacitivaDim = ndx.dimension(function (d){return d["energia capacitiva"];});
  var eAparenteDim = ndx.dimension(function(d){return d["energia aparente"];})
  var fPotenciaDim = ndx.dimension(function (d){return d["factor potencia total"];});

  var fechasDim = ndx.dimension(function(d){return d["estampa tiempo"]["$date"]});

  var fechasGroup = fechasDim.group();
//      var frecuenciaGroup = fechasDim.group().reduceSum(function (d){return d["frecuencia"];});

  var vL1Group = fechasDim.group().reduceSum(function (d){return d["voltaje L1"];});
  var vL2Group = fechasDim.group().reduceSum(function (d){return d["voltaje L2"];});
  var vL3Group = fechasDim.group().reduceSum(function (d){return d["voltaje L3"];});

  var activaGroup = fechasDim.group().reduceSum(function (d){return d["potencia Activa Total"];});
  var reactivaGroup = fechasDim.group().reduceSum(function (d){return d["potencia reactiva total"];});
  var aparenteGroup = fechasDim.group().reduceSum(function (d){return d["potencia aparente total"];});

  var iL1Group = fechasDim.group().reduceSum(function (d){return d["corriente L1"];});
  var iL2Group = fechasDim.group().reduceSum(function (d){return d["coriente L2"];});
  var iL3Group = fechasDim.group().reduceSum(function (d){return d["corriente L3"];});

  var eActivaGroup = eActivaDim.group();
  var eInductivaGroup = eActivaDim.group();
  var eCapacitivaGroup = eActivaDim.group();

  var fPotenciaGroup = fechasDim.group().reduceSum(function (d){return d["factor potencia total"];});
  var consumo = ndx.groupAll().reduceSum(function(d) {return d["potencia Activa Total"]*0.0166666666});
//    var consumoGroup = fechasDim.group().reduceSum(function (d){return d["energia activa"];});
//      var potenciaActGroup = potenciaActDim.group();
//      var potenciaReaGroup = potenciaReaDim.group();
//      var potenciaApaGroup = potenciaApaDim.group();

  var minDate = fechasDim.bottom(1)[0]["estampa tiempo"]["$date"];
  var maxDate = fechasDim.top(1)[0]["estampa tiempo"]["$date"];

  fechasChart /* dc.barChart('#monthly-volume-chart', 'chartGroup'); */
      .x(d3.time.scale().domain([minDate, maxDate]))
      .dimension(fechasDim)
      .group(aparenteGroup)
      .colors('#008b8b')
      .centerBar(true)
      .mouseZoomable(true)
      .gap(1)
      .xAxisLabel('Fecha y hora')
      .yAxisLabel('Potencia Aparente')
      //.yAxis().ticks(5)

  potenciasChart
    .x(d3.time.scale().domain([minDate, maxDate]))
  //  .yAxisLabel("The Y Axis")
    .legend(dc.legend().x(50).y(90).itemHeight(13).gap(5))
    .dimension(fechasDim)
    .renderHorizontalGridLines(true)
    .mouseZoomable(true)
    .rangeChart(fechasChart)
    .xAxisLabel('Fecha y hora')
    .yAxisLabel('Potencia [Watt]')
    .compose([dc.lineChart(potenciasChart)
      .renderArea(true)
      .colors('orange')
      .group(reactivaGroup, "Potencia Reactiva Total"),
      //.dashStyle([2,2]),
    dc.lineChart(potenciasChart)
      .renderArea(true)
      .colors('green')
      .group(activaGroup,"Potencia Activa Total"),
      //.dashStyle([5,5])
      ])
      .brushOn(false)

    voltajesChart
      .x(d3.time.scale().domain([minDate, maxDate]))
    //  .yAxisLabel("The Y Axis")
      .legend(dc.legend().x(50).y(90).itemHeight(13).gap(5))
      .dimension(fechasDim)
      .renderHorizontalGridLines(true)
      .mouseZoomable(true)
      .rangeChart(fechasChart)
      .xAxisLabel('Fecha y hora')
      .yAxisLabel('Voltaje [V]')
      .compose([dc.lineChart(voltajesChart)
        .renderArea(true)
        .colors('orange')
        .group(vL1Group,"Voltaje Línea 1"),
        //.dashStyle([2,2]),
      dc.lineChart(voltajesChart)
        .renderArea(true)
        .colors('green')
        .group(vL2Group, "Voltaje Línea 2"),
        //.dashStyle([5,5])
      dc.lineChart(voltajesChart)
        .renderArea(true)
        .colors('blue')
        .group(vL3Group, "Voltaje Línea 3")
          //.dashStyle([5,5])
        ])
        .brushOn(false)

      corrientesChart
          .x(d3.time.scale().domain([minDate, maxDate]))
        //  .yAxisLabel("The Y Axis")
          .legend(dc.legend().x(50).y(90).itemHeight(13).gap(5))
          .dimension(fechasDim)
          .renderHorizontalGridLines(true)
          .mouseZoomable(true)
          .rangeChart(fechasChart)
          .xAxisLabel('Fecha y hora')
          .yAxisLabel('Corriente [A]')
          .compose([dc.lineChart(corrientesChart)
            .renderArea(true)
            .colors('orange')
            .group(iL1Group,"Corriente Línea 1"),
            //.dashStyle([2,2]),
          dc.lineChart(corrientesChart)
            .renderArea(true)
            .colors('green')
            .group(iL2Group, "Corriente Línea 2"),
            //.dashStyle([5,5])
          dc.lineChart(corrientesChart)
            .renderArea(true)
            .colors('blue')
            .group(iL3Group, "Corriente Línea 3")
              //.dashStyle([5,5])
            ])
            .brushOn(false)

      eActivaChart
        .dimension(eActivaDim)
        .group(eActivaGroup)
        .gap(0.5)
        .xAxis().ticks(5);

      eInductivaChart
        .dimension(eInductivaDim)
        .group(eInductivaGroup)
        .gap(0.5)
        .xAxis().ticks(5);

      eCapacitivaChart
        .dimension(eCapacitivaDim)
        .group(eCapacitivaGroup)
        .gap(0.5)
        .xAxis().ticks(5);

    visCount
      .dimension(ndx)
      .group(all);

    consumoIndi
    .formatNumber(d3.format("d"))
    .valueAccessor(function(d){return d; })
    .group(consumo)
    .formatNumber(d3.format(".3s"));

  dc.renderAll();



});
