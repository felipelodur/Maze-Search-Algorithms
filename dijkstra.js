
function Dijkstra(map, start, end, allowDiagonals) {
    this.map = map;
    this.lastCheckedNode = start;
    this.openSet = [];
    this.openSet.push(start);
    this.closedSet = [];
    this.start = start;
    this.end = end;
    this.allowDiagonals = allowDiagonals;


    this.visualDist = function(a, b) {
        return dist(a.i, a.j, b.i, b.j);
    }

    this.heuristic = function(a, b) {
        var d;
        if (allowDiagonals) {
            d = dist(a.i, a.j, b.i, b.j);
        } else {
            d = abs(a.i - b.i) + abs(a.j - b.j);
        }
        return d;
    }

    this.removeFromArray = function(arr, elt) {
        // Could use indexOf here instead to be more efficient
        for (var i = arr.length - 1; i >= 0; i--) {
            if (arr[i] == elt) {
                arr.splice(i, 1);
            }
        }
    }

    //Run one finding step.
    //returns 0 if search ongoing
    //returns 1 if goal reached
    //returns -1 if no solution
    this.step = function() {

        if (this.openSet.length > 0) {

            // Best next option
            var winner = 0;
            for (var i = 1; i < this.openSet.length; i++) {
                if (this.openSet[i].f < this.openSet[winner].f) {
                    winner = i;
                }
                //if we have a tie according to the standard heuristic
                if (this.openSet[i].f == this.openSet[winner].f) {
                    //Prefer to explore options with longer known paths (closer to goal)
                    if (this.openSet[i].g > this.openSet[winner].g) {
                        winner = i;
                    }
                    //if we're using Manhattan distances then also break ties
                    //of the known distance measure by using the visual heuristic.
                    //This ensures that the search concentrates on routes that look
                    //more direct. This makes no difference to the actual path distance
                    //but improves the look for things like games or more closely
                    //approximates the real shortest path if using grid sampled data for
                    //planning natural paths.
                    if (!this.allowDiagonals) {
                        if (this.openSet[i].g == this.openSet[winner].g &&
                            this.openSet[i].vh < this.openSet[winner].vh) {
                            winner = i;
                        }
                    }
                }
            }
            var current = this.openSet[winner];
            this.lastCheckedNode = current;

            // Did I finish?
            if (current === this.end) {
                console.log("DONE!");
                return 1;
            }

            // Best option moves from openSet to closedSet
            this.removeFromArray(this.openSet, current);
            this.closedSet.push(current);

            // Check all the neighbors
            var neighbors = current.getNeighbors();

            for (var i = 0; i < neighbors.length; i++) {
                var neighbor = neighbors[i];

                // Valid next spot?
                if (!this.closedSet.includes(neighbor)) {
                    var tempG = current.g;

                    if (!this.openSet.includes(neighbor)) {
                        this.openSet.push(neighbor);
                    } else if (tempG >= neighbor.g) {
                        continue;
                    }

                    neighbor.g = tempG;
                    if (!allowDiagonals) {
                        neighbor.vh = this.visualDist(neighbor, end);
                    }
                    neighbor.f = neighbor.g;
                    neighbor.previous = current;
                }

            }
            return 0;
        } else {
            console.log('no solution');
            return -1;
        }
    }
}
