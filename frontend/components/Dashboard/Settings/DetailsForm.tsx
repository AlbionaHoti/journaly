import React from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from '../../../config/i18n'
import FormError from '../../../components/FormError'
import SettingsForm from '../../../components/Dashboard/Settings/SettingsForm'
import SettingsFieldset from '../../../components/Dashboard/Settings/SettingsFieldset'
import Button, { ButtonVariant } from '../../../elements/Button'
import theme from '../../../theme'

const DetailsForm: React.FC = () => {
  const { t } = useTranslation('settings')
  const { handleSubmit, register, errors } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
  })

  const fieldErrorName = Object.keys(errors)[0] || ''
  const fieldError = errors[fieldErrorName]

  const handleDetailsSubmit = (): void => {}
  const handleSubmitImageClick = (): void => {
    // TODO save new image
  }

  return (
    <SettingsForm onSubmit={handleSubmit(handleDetailsSubmit)}>
      <SettingsFieldset legend={t('profile.details.legend')}>
        <div className="details-wrapper">
          <div className="profile-image-wrapper">
            <img className="profile-image" src="/images/robin-small.png" />

            <Button
              onClick={handleSubmitImageClick}
              className="settings-submit-button"
              variant={ButtonVariant.Secondary}
            >
              {t('profile.details.submitImage')}
            </Button>
          </div>

          <div className="details-form-fields-wrapper">
            {fieldError && <FormError error={fieldError.message as string} />}

            <div className="details-form-fields">
              <div className="details-form-field">
                <label className="settings-label" htmlFor="first-name">
                  First Name
                </label>
                <input
                  type="text"
                  name="first-name"
                  className="j-field"
                  ref={register({ required: 'First name is required' })}
                />
              </div>
              <div className="details-form-field">
                <label className="settings-label" htmlFor="last-name">
                  Last Name
                </label>
                <input type="text" name="last-name" className="j-field" />
              </div>
              <div className="details-form-field">
                <label className="settings-label" htmlFor="handle">
                  Handle
                </label>
                <input
                  type="text"
                  name="handle"
                  className="j-field"
                  ref={register({ required: 'Handle is required' })}
                />
              </div>
              <div className="details-form-field">
                <label className="settings-label" htmlFor="location">
                  Location (optional)
                </label>
                <input type="text" name="location" className="j-field" ref={register()} />
              </div>
            </div>

            <Button
              type="submit"
              className="settings-submit-button"
              variant={ButtonVariant.Secondary}
            >
              {t('updateButton')}
            </Button>
          </div>
        </div>
      </SettingsFieldset>

      <style jsx>{`
        .details-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 16px;
        }
        @media (min-width: ${theme.breakpoints.MD}) {
          .details-wrapper {
            flex-direction: row;
            justify-content: flex-start;
            align-items: flex-start;
          }
        }

        .profile-image-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex-shrink: 0;
          width: 150px;
          margin: 0 50px;
        }
        @media (min-width: ${theme.breakpoints.LG}) {
          .profile-image-wrapper {
            margin-top: 30px;
          }
        }

        .profile-image {
          width: 100%;
          height: 150px;
          border-radius: 50%;
          object-fit: cover;
        }

        .details-form-fields-wrapper {
          width: 100%;
          margin-top: 40px;
        }
        @media (min-width: ${theme.breakpoints.MD}) {
          .details-form-fields-wrapper {
            margin: 0 25px;
          }
        }

        .details-form-fields-wrapper :global(.form-error) {
          margin-bottom: 24px;
        }

        .details-form-fields {
          display: grid;
          grid-gap: 24px;
        }
        @media (min-width: ${theme.breakpoints.MD}) {
          .details-form-fields {
            grid-template-columns: 320px;
            margin-top: 0;
          }
        }
        @media (min-width: ${theme.breakpoints.LG}) {
          .details-form-fields {
            grid-template-columns: 320px 320px;
          }
        }

        .details-form-fields input[name="${fieldErrorName}"] {
          border-color: ${theme.colors.red};
        }

        .details-form-field {
          display: flex;
          flex-direction: column;
        }
      `}</style>
    </SettingsForm>
  )
}

export default DetailsForm
