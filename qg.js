window.onload = function () {
  // Example queries
  var q = new Array();
  q[0] = 'SELECT table1.champ1, table2.champ2 AS "label", FONCTION2(table3.champ3, 5,12,13,49), FONCTION(table3.champ3, 5) "autre label" FROM table1, table2 LEFT JOIN table2 ON table2.id = table1.id_table1 JOIN table3 ON table3.id = table2.id_table3 AND table2.truc = 5 OR table.batman = table.robin LEFT JOIN table2 ON table2.id = table1.id_table1 WHERE table1.machin = "bidule" AND (table2.truc != UPPER("chose (grth") OR `table3`.`batman`<=10) AND (machin) AND machin IS NOT NULL OR machin IS null ORDER BY table1.id ASC, table2.id DESC LIMIT 1,100';
  q[1] = 'DELETE FROM table WHERE id = 5;';
  q[2] = 'DELETE FROM table WHERE id = 5; DELETE FROM table WHERE id = 5; SELECT FONCTION_BIDON(1;2;3) FROM table;';
  q[3] = 'SELECT * FROM table ORDER BY id ASC';
  q[4] = 'SELECT EXTRACT(MICROSECOND FROM "2003-01-02 10:30:00.00123"), FONCTION_BIDON(1;2;3) FROM table INNER JOIN table2 ON table2.id = table.id_table2';
  q[5] = 'SELECT * FROM table WHERE batman = 1';
  q[6] = 'INSERT INTO table (test,test2, test3, contents) VALUES(1,2,3, "grogktr optkrhorp, geophgktrhopk , t")';
  q[7] = 'UPDATE table SET truc = "machin", bidule=7 WHERE bool_column';
  q[8] = 'SELECT table1.column1, UPPER(table2.column2) AS "alias for column2" FROM table1 LEFT JOIN table2 ON `table1`.`id` = table2.id_table1 WHERE table1.column1 AND (table2.column2 != 5 OR table.column3 IS NOT NULL) ORDER BY table1.id ASC, table2.id DESC LIMIT 5;';

  // Parse & display
  /*q.forEach(function (item, key) {
					console.log('**********************************************************************');
					var ast = simpleSqlParser.sql2ast(item);
					console.log(ast);
					//console.log(simpleSqlParser.ast2sql(ast));
				});*/

  /*

				q1ast = simpleSqlParser.sql2ast(q[1]);
				q2ast = simpleSqlParser.sql2ast(q[7]);
				q1Keys = Object.keys(q1ast);
				q2Keys = Object.keys(q2ast);
				console.log(q1Keys);
				console.log(q2Keys);

				q1Keys.forEach(function(key){
					if(q2ast[key]){
						temp = q2ast[key];
						q2ast[key] = q1ast[key];
						q1ast[key] = temp; 
					}
				});
				console.log(simpleSqlParser.ast2sql(q1ast));
				console.log(simpleSqlParser.ast2sql(q2ast));
			};

			*/

  var selection = function () {
    var parent1Index = Math.floor((Math.random() * q.length));
    var parent2Index = Math.floor((Math.random() * q.length));
    return [parent1Index, parent2Index];
  };

  var crossover = function (parentsIndex, pointOfCrossover) {
    var parentsObject = [];
    var keys = [];
    parentsIndex.forEach(function (index) {
      console.log(index);
      console.log("=====> ", q[index]);
      parentsObject.push(simpleSqlParser.sql2ast(q[index]));
      Object.keys(parentsObject[parentsObject.length - 1]).forEach(function (key) {
        var shouldAdd = true;
        for (var i = 0; i < keys.length; i++) {
          if (keys[i] === key) {
            shouldAdd = false;
            i = keys.length;
          }
        }
        if (shouldAdd) {
          keys.push(key);
        }
      });
    });
    var child = [];
    for (var i = 0; i < pointOfCrossover; i++) {
      var keyIndex = Math.floor((Math.random() * keys.length));
      if (parentsObject[0][keys[keyIndex]] || parentsObject[1][keys[keyIndex]]) {
        child.push(JSON.parse(JSON.stringify(parentsObject[0])));
        child.push(JSON.parse(JSON.stringify(parentsObject[1])));
        if (parentsObject[0][keys[i]]) {
          child[0][keys[keyIndex]] = parentsObject[0][keys[keyIndex]];
          child[1][keys[keyIndex]] = parentsObject[0][keys[keyIndex]];
        } else {
          child[0][keys[keyIndex]] = parentsObject[1][keys[keyIndex]];
          child[1][keys[keyIndex]] = parentsObject[1][keys[keyIndex]];
        }
      }
    }

    var runAgain = true;
    var mutateIndex, mutationKey, keyFoundInMutation;
    while (runAgain) {
      mutateIndex = Math.floor((Math.random() * q.length));
      mutationKey = Math.floor((Math.random() * keys.length));
      //console.log(q[mutateIndex]);

      if (parentsObject[mutateIndex] && parentsObject[mutateIndex][keys[mutationKey]]) {
        child.forEach(function (crossed) {
          crossed[keys[mutationKey]] = parentsObject[mutateIndex][keys[mutationKey]];
        });
        runAgain = false;
      } else {
        mutateIndex = Math.floor((Math.random() * q.length));
        mutationKey = Math.floor((Math.random() * keys.length));
      }
    }
    return child;
  };

  var fitness = function (children) {
    var fitInPopulation;
    children.forEach(function (child) {
      fitInPopulation = simpleSqlParser.ast2sql(child);
      if (fitInPopulation && typeof fitInPopulation != 'undefined') {
        q.push(fitInPopulation);
      }
      
    });
  }


  var QG = function (selection, crossover, fitness, queriesLimit, pointOfCrossover) {
    while (q.length < queriesLimit) {
      var parentsSelected = selection();
      var children = crossover(parentsSelected, pointOfCrossover);
      fitness(children);
    }

    debugger;
    q.forEach(function (item, index) {
      console.log("\n" + index + 1 + ") ")
      console.log(item);
    });
  }
  QG(selection, crossover, fitness, 1000, 1);
}