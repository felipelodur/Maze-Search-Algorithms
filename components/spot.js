function Spot(i, j, x, y, width, height, isWall, grid) {

    this.grid = grid;

    // Location
    this.i = i;
    this.j = j;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    // f, g, and h values
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.vh = 0;

    // About me
    this.neighbors = undefined;
    this.neighboringWalls = undefined;
    this.previous = undefined;
    this.wall = isWall;
    this.visited = false;

    this.show = function(color) {
        if (this.wall) {
            fill(0);
            noStroke();

            if (drawingOption === 0) {
                ellipse(this.x + this.width * 0.5, this.y + this.width * 0.5, this.width * 0.5, this.height * 0.5);
            } else {
                rect(this.x, this.y, this.width, this.height);
            }

            stroke(0);
            strokeWeight(this.width / 2);

            var nWalls = this.getNeighboringWalls(this.grid);
            for (var i = 0; i < nWalls.length; i++) {
                var nw = nWalls[i];

                if ((nw.i > this.i && nw.j == this.j) ||
                    (nw.i == this.i && nw.j > this.j)) {
                    line(this.x + this.width / 2,
                        this.y + this.height / 2,
                        nw.x + nw.width / 2,
                        nw.y + nw.height / 2);
                }

                if (!canPassThroughCorners && (nw.j > this.j) &&
                    (nw.i < this.i || nw.i > this.i)) {
                    line(this.x + this.width / 2,
                        this.y + this.height / 2,
                        nw.x + nw.width / 2,
                        nw.y + nw.height / 2);
                }
            }
        } else if (color) {
            fill(color);
            noStroke();
            rect(this.x, this.y, this.width, this.height);
        }
    }

    this.getNeighbors = function() {
        if (!this.neighbors) {
            this.populateNeighbors();
        }
        return this.neighbors;
    }

    this.getNeighboringWalls = function(grid) {

        if (!this.neighboringWalls) {
            this.populateNeighbors();
        }

        return this.neighboringWalls;
    }

    var LURDMoves = [
        [-1, 0],
        [0, -1],
        [1, 0],
        [0, 1]
    ];
    var DiagonalMoves = [
        [-1, -1],
        [1, -1],
        [1, 1],
        [-1, 1]
    ];
    //references to the LURDMoves entries that would block the diagonal
    //if they are both walls and canPassThroughCorners = false
    var DiagonalBlockers = [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 0]
    ];

    //return node or null if request is out of bounds
    this.getNode = function(i, j) {
        if (i < 0 || i >= this.grid.length ||
            j < 0 || j >= this.grid[0].length) {
            return null;
        }
        return this.grid[i][j];
    }

    //populate neighbor move and neighbor wall arrays
    this.populateNeighbors = function() {
        this.neighbors = [];
        this.neighboringWalls = [];

        //4-neighbor moves
        for (var i = 0; i < 4; i++) {
            var node = this.getNode(this.i + LURDMoves[i][0], this.j + LURDMoves[i][1]);
            if (node != null) {
                if (!node.wall) {
                    this.neighbors.push(node);
                } else {
                    this.neighboringWalls.push(node);
                }
            }
        }

        //8-neighbor moves
        for (var i = 0; i < 4; i++) {
            var gridX = this.i + DiagonalMoves[i][0];
            var gridY = this.j + DiagonalMoves[i][1];

            var node = this.getNode(gridX, gridY);

            if (node != null) {
                if (allowDiagonals && !node.wall) {
                    if (!canPassThroughCorners) {
                        //Blocked by walls?
                        var border1 = DiagonalBlockers[i][0];
                        var border2 = DiagonalBlockers[i][1];
                        var blocker1 = this.grid[this.i + LURDMoves[border1][0]]
                                                [this.j + LURDMoves[border1][1]];
                        var blocker2 = this.grid[this.i + LURDMoves[border2][0]]
                                                [this.j + LURDMoves[border2][1]];


                        if (!blocker1.wall || !blocker2.wall) {
                            this.neighbors.push(node);
                        }
                    }else {
                        this.neighbors.push(node);
                    }
                }
                if (node.wall) {
                    this.neighboringWalls.push(node);
                }
            }
        }
    }

}
