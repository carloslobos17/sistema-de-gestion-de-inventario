import { UserRepository } from './user.repository';

export class UserService {
    private userRepository = new UserRepository();

    async listar() {
        return this.userRepository.findAll();
    }
}