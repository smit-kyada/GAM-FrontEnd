import { AbilityBuilder, Ability } from '@casl/ability'

export const AppAbility = Ability

/**
 * Please define your own Ability rules according to your app requirements.
 * We have just shown Admin and Client rules for demo purpose where
 * admin can manage everything and client can just visit ACL page
 */

const defineRulesFor = (role, subject, user) => {


  const { can, rules } = new AbilityBuilder(AppAbility)
  if (role === 'admin') {
    can('read', ['home-c', 'notificationmessages-p', 'messages-p', 'gameuser-p', 'messageLog-p', 'affiliateRequest-p', 'user-p', 'siteTable-p','reporttable-p', 'sites-p', 'siteDetail-p', 'reportLog-p', 'subadmin-p', 'deduction-p', 'country', "userAccounts-p", "adsense-p", "livereport-p", "blockusermessage-p"])
  }
  else if (role === 'client') {

    if (user?.block) { can(['read'], ['home-c']) }

    else {
      if (JSON.parse(localStorage.getItem('userData'))?.isSideLogin) {
        can(['read'], ['home-c', 'sitereport-p'])
      }
      else if (user?.isOnlyReport) {
        can(['read'], ['home-c', 'livereport-p'])
      }
      else {
        can(['read'], ['home-c', 'profile-p', 'mysites-p', 'siteDetail-p' ,'reporttable-p', 'country', "account-p", 'myAccounts-p', 'report-p', "verifyOtp", `${user?.showReport && user?.role == "client" ? "livereport-p" : ""}`])
      }
    }
  } else if (role === 'subadmin') {
    can(['read'], ['home-c', 'siteTable-p', 'reporttable-p', 'sites-p', 'user-p', "siteDetail-p"])
  } else {
    can(['read', 'create', 'update', 'delete'], subject)
  }

  return rules
}

export const buildAbilityFor = (role, subject, user) => {
  return new AppAbility(defineRulesFor(role, subject, user), {
    // https://casl.js.org/v5/en/guide/subject-type-detection
    // @ts-ignore
    detectSubjectType: object => object.type
  })
}

export const defaultACLObj = {
  action: 'manage',
  subject: 'all'
}

export default defineRulesFor
