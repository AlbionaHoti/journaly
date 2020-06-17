import React from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from '../../../config/i18n'
import FormError from '../../../components/FormError'
import SettingsForm from '../../../components/Dashboard/Settings/SettingsForm'
import SettingsFieldset from '../../../components/Dashboard/Settings/SettingsFieldset'
import Button, { ButtonVariant } from '../../../elements/Button'

const LanguagesForm: React.FC = () => {
  const { t } = useTranslation('settings')
  const { handleSubmit, register, errors } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
  })

  const fieldErrorName = Object.keys(errors)[0] || ''
  const fieldError = errors[fieldErrorName]
  const handleLanguagesSubmit = (): void => {}

  return (
    <SettingsForm onSubmit={handleSubmit(handleLanguagesSubmit)} errorInputName={fieldErrorName}>
      <SettingsFieldset legend={t('profile.languages.legend')}>
        <div className="languages-wrapper">
          {fieldError && <FormError error={fieldError.message as string} />}

          <div className="languages-form-fields">
            <div className="languages-form-field">
              <label className="settings-label" htmlFor="native-languages">
                {t('profile.languages.nativeLanguagesLabel')}
              </label>
              <input
                type="text"
                id="native-languages"
                name="native-languages"
                className="j-field"
                ref={register({ required: t('profile.languages.nativeLanguagesError') as string })}
              />
            </div>
            <div className="languages-form-field">
              <label className="settings-label" htmlFor="learning-languages">
                {t('profile.languages.learningLanguagesLabel')}
              </label>
              <input
                type="text"
                id="learning-languages"
                name="learning-languages"
                className="j-field"
                ref={register({
                  required: t('profile.languages.learningLanguagesError') as string,
                })}
              />
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
      </SettingsFieldset>

      <style jsx>{`
        .languages-form-field {
          display: flex;
          flex-direction: column;
        }

        .languages-form-field {
          margin-bottom: 24px;
        }

        .languages-form-field:last-child {
          margin-bottom: 0;
        }
      `}</style>
    </SettingsForm>
  )
}

export default LanguagesForm
