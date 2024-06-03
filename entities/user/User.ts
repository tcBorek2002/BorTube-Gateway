import { UserDto } from "../../dtos/UserDto";

export class User {
    id: string;
    email: string;
    password: string;
    displayName: string;
    permissionGrantedDate?: Date;

    constructor(id: string, email: string, password: string, displayName: string, permissionGrantedDate?: Date) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.displayName = displayName;
        this.permissionGrantedDate = permissionGrantedDate;
    }

    // Function that creates a UserDto from user entity
    toDto(): UserDto {
        return {
            id: this.id,
            email: this.email,
            displayName: this.displayName,
            permissionGrantedDate: this.permissionGrantedDate
        };
    }
}
