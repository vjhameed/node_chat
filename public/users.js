/**
 * Created by Administrator on 5/13/2017.
 */
class User {
    constructor(){
        this.users = [];
    }

    getuser(id){
        return this.users.filter((user)=> user.id == id)[0];
    }

    removeuser(id){
        var user = this.getuser(id);

        if(user){
            this.users = this.users.filter((user)=>user.id != id)
        }
        return user;
    }


    adduser(id,name,room){
        var user = {
            id,name,room
        }
        this.users.push(user);
        return user;
    }

    getuserlist(room){
        var users = this.users.filter((user)=> user.room == room );
        var namesarray = users.map((user)=> user.name)
        return namesarray;
    }
}

module.exports = {User};