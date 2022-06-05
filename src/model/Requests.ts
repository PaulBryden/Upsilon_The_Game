import { Position } from "../Position"
import { sprite_type } from "../sprites/sprite";

export class Request
{
    public type: request_type;
    public tick: number;

    public get_tick() : number {
        return this.tick;
    }
    constructor(type: request_type, tick: number)
    {
        this.type=type;
        this.tick=tick;
    }
}

export class  SpriteMoveRequest extends Request {
    public sprite_uuid: number;
    public position: Position;
    constructor(tick: number, sprite_uuid: number, position: Position)
    {
        super(request_type.Move,tick);
        this.sprite_uuid=sprite_uuid;
        this.position=position;
    }
}

export class SpriteCreateRequest extends Request{
    public  sprite_uuid: number;
    public  sprite_type: sprite_type;
    public  position: Position;
}

export enum request_type
{
    Move,
    Create
}

export class RequestQueue {
    requests: Request[];

    constructor()
    {
        this.requests=[];
    }
    public AddRequest(request: Request) {
        this.requests.push(request);
        this.requests.sort((a, b) => {
            if (this.GetTickOfParticularRequest(a) < this.GetTickOfParticularRequest(b)) {
                return -1
            }
            else
            {
                return 1;
            }
        });
    }

    public GetTickOfParticularRequest(request: Request) : number{
        return request.get_tick();
    }

    public GetRequestsOfParticularTick( tick: number) : Request[] {
        let requests: Request[]= [];
        this.requests.forEach((request: Request) => {
            if (request.get_tick() == tick) {
                requests.push(request)
            }
        });
        return requests;
    }
    public PurgeRequestsOlderThanTick(tick: number) {
        this.requests=this.requests.filter(w => w.get_tick()>=tick);
    }

    public GetNumberOfRequests() : number {
        return this.requests.length;
    }
}
