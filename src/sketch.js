/**
 * @fileoverview Sketch class for use with the Biolab activity suite.
 * @copyright Carnegie Mellon University 2019
 * @author zmineroff@cmu.edu (Zach Mineroff)
 */

import '@cmu-eberly-center/p5/lib/addons/p5.dom.js';
import 'p5.play';
import Beaker from 'p5.beaker/beaker.js';
import ConjugateBase from 'p5.beaker/conjugate_base.js';
import Proton from 'p5.beaker/proton.js';


export const numConjugateBases = 10;
export const numProtons = 10;
export let numAcids = 0;


var particleTableUpdate = function(pNumAcids,pNumConjugateBases) {
  pNumAcids.html(numAcids);
  pNumConjugateBases.html(numConjugateBases-numAcids);
}

var particleTableColumn = function(p,table,column_data) {
  const images = column_data["images"];
  const image_div = p.createDiv().class("particle");
  if (images) {
      images.forEach((image) => {
          image_div.child(image);
      });
  }
  const label = column_data["label"];
  const data = column_data["data"];
  const column = p.createDiv();
  column.
      child(image_div).
      child(p.createP(label).class("label")).
      child(data);
  table.child(column);
}

var particleTableSetup = function(p,pNumAcids,pNumConjugateBases) {
  var table = p.createDiv().id("particle-table")

  // Acid column
  const acid_column_data = {};
  acid_column_data["images"] = [
      p.createImg(ConjugateBase.prototype.
                  image_path,'Conjugate Base').class("base"),
      p.createImg(Proton.prototype.
                  image_path,'Proton').class("proton")
  ];
  acid_column_data["label"] = "acid";
  acid_column_data["data"] = pNumAcids;
  particleTableColumn(p,table,acid_column_data);

  // Comparison column
  const comparison_column_data = {};
  comparison_column_data["label"] = "&lt;=&gt;"
  particleTableColumn(p,table,comparison_column_data);

  // Conjugate base column
  const conjugate_base_column_data = {};
  conjugate_base_column_data["images"] = [
      p.createImg(ConjugateBase.
                  prototype.image_path,
                  'Conjugate Base')
  ];
  conjugate_base_column_data["label"] = "conjugate base";
  conjugate_base_column_data["data"] = pNumConjugateBases;
  particleTableColumn(p,table,conjugate_base_column_data);

};

var displayPHSetup = function(pPH) {
  var pH = -7.0*(parseFloat(numProtons)-64.0)/32.0;
  pPH.html(`pH: ${Number((pH).toFixed(2))}`);
}

// Register callbacks to update UI
var registerUICallbacks = function (pPH,pNumAcids,pNumConjugateBases) {
  ConjugateBase.prototype.register_callback("release_proton","pre",
    () => {
      numAcids -= 1;
      particleTableUpdate(pNumAcids,
        pNumConjugateBases);
    });
  ConjugateBase.prototype.register_callback("reacts_with_proton","post",
    () => {
      numAcids += 1;
      particleTableUpdate(pNumAcids,pNumConjugateBases);
    });
}


var UISetup = function(p) {
  var pNumConjugateBases = p.createP(numConjugateBases).
      id("num-conjugate-bases");
  var pNumAcids = p.createP(numAcids).id("num-acids");
  particleTableSetup(p,pNumAcids,pNumConjugateBases);

  var pPH = p.createP('0').id('ph');
  displayPHSetup(pPH);

  registerUICallbacks(pPH,pNumAcids,pNumConjugateBases);
}


/**
 * A Biolab sketch
 * @class Sketch
 */
export default function Sketch(p) {
  let beaker = null;

  p.preload = function() {
      Beaker.prototype.preload(p);
      ConjugateBase.prototype.preload(p);
      Proton.prototype.preload(p);
  }

  p.setup = function() {
      p.createCanvas(500,500);
      p.background(255,255,255);

      beaker = new Beaker(p,286,278,0,40,38,75);

      UISetup(p,beaker);

      beaker.addParticles(ConjugateBase,numConjugateBases);
      beaker.addParticles(Proton,numProtons);
  };

  p.draw = function() {
      beaker.step();
      beaker.draw();
  };
}
