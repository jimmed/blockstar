import gql from "graphql-tag";
import { IPAddresses } from "../../ipc/useIpAddress";
import { FullUserFragment, FULL_USER_FRAGMENT } from "../fragment/fullUser";
import { Mutation } from "../lib/Mutation";

export interface UpdateIpAddressResult {
  updateIpAddress: FullUserFragment;
}

export const UPDATE_IP_ADDRESS_MUTATION = gql`
  mutation updateIpAddress($ipv4: String, $ipv6: String) {
    updateIpAddress(ipv4: $ipv4, ipv6: $ipv6) {
      ...FullUser
    }
  }
  ${FULL_USER_FRAGMENT}
`;

export const updateIpAddressMutation = Mutation.fromGql<UpdateIpAddressResult>(
  UPDATE_IP_ADDRESS_MUTATION
)
  .extract("updateIpAddress")
  .withVariables((args?: IPAddresses) => args);
