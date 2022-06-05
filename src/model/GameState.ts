import { Position } from "../Position";
import { EngineerSprite } from "../sprites/engineersprite";
import { Sprite, sprite_type } from "../sprites/sprite";

export class GameState {
    sprite_map: Map<number, Sprite>;
    sprite_uuid_list: number[];
    selected_entity: number;

    public sort_by_z_index() {
        this.sprite_uuid_list.sort((a, b) => {
            if (this.sprite_map.get(a).get_z_index() < this.sprite_map.get(b).get_z_index()) {
                return -1
            }
            else if (this.sprite_map.get(a).get_z_index() == this.sprite_map.get(b).get_z_index()) {
                //This is for when we need to make sure actual interactive sprites render on top.
                let a_val = 0;
                let b_val = 0;
                if (this.sprite_map.get(a).type == sprite_type.tile) {
                    a_val = 1;
                }
                if (this.sprite_map.get(b).type == sprite_type.tile) {
                    b_val = 1;
                }
                if (a_val < b_val) {
                    return -1
                }
                else {
                    return 1;
                }
            }
            else {
                return 1;
            }
        });
    }
    

    public mark_new_selected_sprite(uuid: number) {
        if (this.selected_entity != 0) {
            let sprite = this.sprite_map.get(this.selected_entity);
            if(sprite.type==sprite_type.engineer)
            {
                let engineer_entity=sprite as EngineerSprite;
                    engineer_entity.selected = false;
            }
        }
        let sprite = this.sprite_map.get(uuid);
        if(sprite.type==sprite_type.engineer)
        {
            let engineer_entity=sprite as EngineerSprite;
                engineer_entity.selected = true;
                this.selected_entity = uuid;
        }
    }

    public process_tick(tick: number) {
        this.sprite_uuid_list.forEach(( uuid: number) => {
            let sprite = this.sprite_map.get(uuid);
            switch (sprite.type)
            {
                case sprite_type.engineer: 
                (sprite as EngineerSprite).tick(1);

            }
        });
    }


    public is_sprite_within_bounds(mouse_coords: Position): number | undefined {
        let selected = 0;
        this.sprite_uuid_list.forEach((uuid: number) => {
            let sprite = this.sprite_map.get(uuid);
            switch (sprite.type) {
                case sprite_type.engineer:
                    if (sprite.is_within_bounds(mouse_coords)) {
                        selected = sprite.uuid;
                    }
                default: { }
            };
        });
        return selected;
    }

    public render() {
        this.sort_by_z_index();
        this.sprite_uuid_list.forEach((uuid: number) => {
            this.sprite_map.get(uuid).draw();
        });
    }

}