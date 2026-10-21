import { useCurrentUser } from './useCurrentUser';

export function useCanManageStructure(): boolean {
    return useCurrentUser()?.can_manage_structure === true;
}
