export class UserDto {
    id: string;
    email: string;
    displayName: string;

    constructor(id: string, email: string, displayName: string) {
        this.id = id;
        this.email = email;
        this.displayName = displayName;
    }

    // Static function that creates a UserDto from user entity
    static fromUser({ id, email, displayName }: { id: string; email: string; displayName: string }): UserDto {
        return new UserDto(id, email, displayName);
    }
}