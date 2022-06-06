import { Pathfinder } from "../pathfinding/pathfinder";
import { GameState } from "./GameState"
import { RequestQueue, Request, request_type, SpriteMoveRequest } from "./Requests"
import cloneDeep from 'lodash.clonedeep';
import { EngineerSprite } from "../sprites/engineersprite";
import { Position } from "../Position";
import { world_to_grid_coords } from "../sprites/sprite";

export enum RequestStatus {
    Synchronized,
    Desynchronized
}
export class GameManager {
    public requests: RequestQueue; //Requests are global and maintain as much history as game_state_history.
    public game_state_history: Map<number, GameState>;
    public current_game_state: GameState;
    public last_tick: number;
    public pathfinder: Pathfinder;

    constructor(requests: RequestQueue, game_state_history: Map<number,GameState>, current_game_state: GameState, last_tick: number,pathfinder: Pathfinder){
        this.requests=requests;
        this.game_state_history=game_state_history;
        this.current_game_state=current_game_state;
        this.last_tick=last_tick;
        this.pathfinder=pathfinder;
    }
    public process_tick(tick: number) {
        let local_tick = tick;
        if (local_tick > this.last_tick) {
            this.last_tick = local_tick;
            this.process_tick_work(local_tick);
        } else {
            this.current_game_state = (this.game_state_history.get(tick));
            while (local_tick <= this.last_tick) {
                this.process_tick_work(tick);
                local_tick = local_tick + 1;
            }
        }
    }
    public process_tick_work(tick: number) {
        let requests_to_be_processed = this.requests.GetRequestsOfParticularTick(tick);
        /*Process Requests Here*/

        requests_to_be_processed.forEach((request: Request) => {
            this.process_request(request);
        });
        /***********************/
        this.current_game_state.process_tick(tick);
        this.game_state_history
            .set(tick, cloneDeep(this.current_game_state));
        if (tick > 47) {
            this.game_state_history.delete(tick - 47);
        }
    }

    public process_request(request: Request) {
        switch (request.type) {
            case request_type.Move: {
                let move_request = request as SpriteMoveRequest;
                let selected_entity = this.current_game_state.sprite_map.get(this.current_game_state.selected_entity);
                let engineer_entity = (selected_entity as EngineerSprite);
                let path = this.pathfinder.find_path(
                    new Position(
                        Math.round(selected_entity.get_tile_pos().x),
                        Math.round(selected_entity.get_tile_pos().y),
                    ),
                    new Position(
                        Math.round((move_request.position.x)),
                        Math.round((move_request.position.y)),
                    ),
                );
                engineer_entity.update_path(path)
                break;
            }

            default: {
                //statements; 
                break;
            }
        }
    }

    public render() {
        this.current_game_state.render();
    }
    public addRequest(request: Request) : RequestStatus {
    this.requests.AddRequest(request);
    if (request.get_tick() < this.last_tick && (this.last_tick - request.get_tick()) < 45)
    //Received old request. Time to synchronize
    {
        this.process_tick(request.get_tick());
        return RequestStatus.Synchronized;
    } else if (this.last_tick > 45 && request.get_tick() < this.last_tick && (this.last_tick - request.get_tick()) > 45)
        //Request is too old. Game State is desynchronized.
        {
        return RequestStatus.Desynchronized;
    } else {
        if (this.last_tick > 47) {
            this.requests
                .PurgeRequestsOlderThanTick(this.last_tick - 47);
        }
        return RequestStatus.Synchronized;
    }
}
    public mouse_clicked(mouse_coords: Position) {
    let selected_unit_uuid = this
        .current_game_state
        .is_sprite_within_bounds(mouse_coords); //if it is within bounds, selection has occured. If it is not within bounds, move or other operation has been requested.
        if( selected_unit_uuid!=undefined && selected_unit_uuid!=0) {
            this.current_game_state.mark_new_selected_sprite(selected_unit_uuid);
        }else {
            /*Move Request*/
            if (this.current_game_state.selected_entity != 0) {
                let request = new SpriteMoveRequest (
                    this.last_tick + 10,
                    this.current_game_state.selected_entity,
                    new Position(
                     (world_to_grid_coords(mouse_coords).x -2.0),
                      (world_to_grid_coords(mouse_coords).y - 1.0),
                    )
                );
                this.addRequest(request);
            }
        }
    }
}