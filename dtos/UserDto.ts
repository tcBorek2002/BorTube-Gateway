export class UserDto {
    id: string;
    email: string;
    displayName: string;
    permissionGrantedDate?: Date;

    constructor(id: string, email: string, displayName: string, permissionGrantedDate?: Date) {
        this.id = id;
        this.email = email;
        this.displayName = displayName;
        this.permissionGrantedDate = permissionGrantedDate;
    }

    // Static function that creates a UserDto from user entity
    static fromUser({ id, email, displayName, permissionGrantedDate }: { id: string; email: string; displayName: string, permissionGrantedDate?: Date }): UserDto {
        return new UserDto(id, email, displayName, permissionGrantedDate);
    }
}