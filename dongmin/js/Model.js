var point_tp_obj;
var poly_tp_obj;
var line_obj;

var isFirst = true;
var selectedTime = [];
var anime_entity = null;
var pre_cl, pre_entity;

var mode;
var polygon_mode;

var viewer;
var scene;

var LOG = console.log;
var moving_features = [];

function MovingFeature(id, viewer){
  this.viewer = viewer;
  this.id = id;
  this.feature = feature;
}
