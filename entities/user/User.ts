import { UserDto } from "../../dtos/UserDto";

export class User {
    id: string;
    email: string;
    password: string;
    displayName: string;

    constructor(id: string, email: string, password: string, displayName: string) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.displayName = displayName;
    }

    // Function that creates a UserDto from user entity
    toDto(): UserDto {
        return {
            id: this.id,
            email: this.email,
            displayName: this.displayName
        };
    }
}
