import { useMutation } from '@apollo/client';
import { CHANGE_CURRENT_ORGANIZATION } from '../../../graphql/queries/organizations';
import Styles from './OrganizationMenu.module.scss';

export default function OrganizationMenu({
  organizations,
}) {
  const [changeOrganization] = useMutation(
    CHANGE_CURRENT_ORGANIZATION,
    {
      onCompleted: (response) => {
        const { errors: errorsEdit } =
          response.changeOrganization;

        if (!errorsEdit.length) {
          window.location.reload();
        }
      },
    }
  );

  const handleChangeOrganizationSubmit = (
    organizationId
  ) => {
    changeOrganization({
      variables: {
        input: {
          id: organizationId,
        },
      },
    });
  };

  return (
    <ul
      className={Styles.organizationMenuContainer}
      style={{ fontSize: '14px' }}
    >
      {organizations.map((organization, index) => (
        <div
          className={Styles.menuItem}
          tabIndex={index}
          role="button"
          onClick={() =>
            handleChangeOrganizationSubmit(organization?.id)
          }
        >
          <div>
            <span>{organization.name}</span>
          </div>
        </div>
      ))}
    </ul>
  );
}
