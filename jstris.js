var screen = 
[
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0]
];
occupied = [];
current_figure = [];
/*
    1. ##   2. #      3. #    4.  #
       ##      #         ##      ##
               #          #      #
               #   

    5. #    6. ##     7. ##
       ##      #          #
       #       #          #
*/

var figures =
[
    /*     x   y     x   y     x   y     x   y */
    [//1
        [[ 0,  0], [ 0,  1], [ 1,  0], [ 1,  1]], // Same in each position
        [[ 0,  0], [ 0,  1], [ 1,  0], [ 1,  1]],
        [[ 0,  0], [ 0,  1], [ 1,  0], [ 1,  1]],
        [[ 0,  0], [ 0,  1], [ 1,  0], [ 1,  1]],
    ],
    [//2
        [[ 0, -2], [ 0, -1], [ 0,  0], [ 0,  1]],
        [[-2,  0], [-1,  0], [ 0,  0], [ 1,  0]],
        [[ 0, -2], [ 0, -1], [ 0,  0], [ 0,  1]],
        [[-2,  0], [-1,  0], [ 0,  0], [ 1,  0]]
    ],
    [//3
        [[ 1, -1], [ 1,  0], [ 0,  0], [ 0,  1]],
        [[-1,  0], [ 0,  0], [ 0,  1], [ 1,  1]],
        [[ 1, -1], [ 1,  0], [ 0,  0], [ 0,  1]],
        [[-1,  0], [ 0,  0], [ 0,  1], [ 1,  1]]
    ],
    [//4
        [[ 0, -1], [ 0,  0], [ 1,  0], [ 1,  1]],
        [[-1,  1], [ 0,  1], [ 0,  0], [ 1,  0]],
        [[ 0, -1], [ 0,  0], [ 1,  0], [ 1,  1]],
        [[-1,  1], [ 0,  1], [ 0,  0], [ 1,  0]]
    ],
    [//5
        [[ 0, -1], [ 0,  0], [ 0,  1], [ 1,  0]],
        [[-1,  0], [ 0,  0], [ 1,  0], [ 0,  1]],
        [[ 1, -1], [ 1,  0], [ 1,  1], [ 0,  0]],
        [[-1,  1], [ 0,  1], [ 1,  1], [ 0,  0]]
    ],
    [//6
        [[ 0, -1], [ 0,  0], [ 0,  1], [ 1, -1]], // **           *   *
        [[-1,  0], [ 0,  0], [ 1,  0], [ 1,  1]], // *    ***     *   ***
        [[ 1, -1], [ 1,  0], [ 1,  1], [ 0,  1]], // *      *    **
        [[-1,  0], [ 0,  0], [ 1,  0], [-1, -1]]  //
    ],
    [//7
        [[ 1, -1], [ 1,  0], [ 1,  1], [ 0, -1]],
        [[-1,  1], [ 0,  1], [ 1,  1], [ 1,  0]],
        [[ 0, -1], [ 0,  0], [ 0,  1], [ 1,  1]],
        [[-1,  0], [ 0,  0], [ 1,  0], [-1,  1]]
    ]
];

var figure_coordinates = [0, 0];
var figure_type = -1;
var figure_position = -1;

function draw_screen_canvas(scr)
{
    var c = document.getElementById("canva");
    var ctx = c.getContext("2d");
    var i, j;
    ctx.clearRect(0, 0, c.width, c.height);
    for(i = 0; i < scr.length; i++)
    {
        for(j = 0; j < scr[0].length; j++)
        {
            if(scr[i][j] == 1)
            {
                ctx.fillRect(j * 20, i * 20, 20, 20);
            }
        }
    }
}

function check_line_eliminate(line)
{
    var i;
    var cell_count = 0;
    for(i = 0; i < occupied.length; i++)
    {
        if(occupied[i][1] == line)
        {
            cell_count++;
        }
    }
    if(cell_count == 10)
    {
        var value = true;
        while(value)
        {
            value = false;
            for(i = 0; i < occupied.length; i++)
            {
                if(occupied[i][1] == line)
                {
                    occupied.splice(i, 1);
                    value = true;
                    break;
                }
            }       
        }
        return true
    }
    return false
}

function check_screen_eliminate()
{
    var eliminated;
    var j;
    for(i = 0; i < 20; i++)
    {
        eliminated = check_line_eliminate(i);
        if(eliminated)
        {
            for(j = 0; j < occupied.length; j++)
            {
                if(occupied[j][1] < i)
                {
                    occupied[j][1] = occupied[j][1] + 1;
                }
            }
        }
    }
}

function update_figure_position()
{
    if(figure_type == -1)
    {
        figure_type = Math.ceil(Math.random() * 10000) % 7;
        figure_position = 0;
        figure_coordinates = [5, 0];
    }
    else
    {
        var x = figure_coordinates[0];
        var y = figure_coordinates[1];
        figure_coordinates = [x, y + 1];
    }
}

function clr_scr()
{
    var i, j;
    for(i = 0; i < 20; i++)
    {
        for(j = 0; j < 10; j++)
        {
            screen[i][j] = 0;
        }
    }
}

function check_ocuppied(x, y)
{
    var i;
    for(i = 0; i < occupied.length; i++)
    {
        if((occupied[i][0] == x) && (occupied[i][1] == y))
        {
            return true;
        }
    }
    if(y >= 20)
    {
        return true;
    }
    return false;
}

function draw_figure(fig)
{
    var i;
    for(i = 0; i < fig.length; i++)
    {
        screen[fig[i][1]][fig[i][0]] = 1;
    }
}

function update_field()
{
    var i, x, y;
    var unprintable_count = 0;
    var fig_updated = [];
    clr_scr();
    for(i = 0; i < 4; i++)
    {
        dx = figures[figure_type][figure_position][i][0];
        dy = figures[figure_type][figure_position][i][1];
        x = figure_coordinates[0] + dx;
        y = figure_coordinates[1] + dy;
        if(check_ocuppied(x, y))
        {
            fig_updated = current_figure.slice();
            occupied = occupied.concat(fig_updated.slice());
            figure_type = -1;
            break;    
        }
        if((y >= 20) || (y < 0) || (x < 0) || (x >= 10))
        {
            unprintable_count++;
            continue;
        }
        fig_updated = fig_updated.concat([[x, y]]);
    }
    if (unprintable_count == 4)
    {
        figure_type = -1;
    }
    draw_figure(fig_updated);
    current_figure = fig_updated.slice();
    draw_figure(occupied);
    check_screen_eliminate();
}

function check_figure_coordinates(cx, cy)
{
    for(i = 0; i < 4; i++)
    {
        dx = figures[figure_type][figure_position][i][0];
        dy = figures[figure_type][figure_position][i][1];
        x = cx + dx;
        y = cy + dy;
        if(check_ocuppied(x, y))
        {
            return false;
        }
        if((y >= 20) || (x < 0) || (x >= 10))
        {
            return false;
        }
    }
    return true;
}

document.onkeydown = function(e) {
    e = e || window.event;
    switch(e.which || e.keyCode) {
        case 32: // space
            if(figure_position == 3)
            {
                figure_position = 0;
            }
            else
            {
                figure_position++;
            }
        break;

        case 37: // left
            if(check_figure_coordinates(figure_coordinates[0]-1, figure_coordinates[1]))
            {
                figure_coordinates[0]--;
            }
            
        break;

        case 39: // right
            if(check_figure_coordinates(figure_coordinates[0]+1, figure_coordinates[1]))
            {
                figure_coordinates[0]++;
            }
        break;

        case 40: // down
            if(check_figure_coordinates(figure_coordinates[0], figure_coordinates[1]+1))
            {
                figure_coordinates[1]++;
            }
        break;

        default: return; // exit this handler for other keys
    }
    e.preventDefault();
    update_field();
    draw_screen_canvas(screen);
}

function do_iteration()
{
    update_figure_position();
    update_field();
    draw_screen_canvas(screen);
    setTimeout(do_iteration, 1000);
}