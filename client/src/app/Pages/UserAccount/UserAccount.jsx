import React from 'react'
import AccountHero from './AccountHero/AccountHero'
import AccountOverview from "./AccountOverview/AccountOverview"
import AccountRecentOrders from './AccountRecentOrders/AccountRecentOrders'
import AccountWishlist from './AccountWishlist/AccountWishlist'
import AccountAddress from './AccountAddress/AccountAddress'
import AccountPreferences from './AccountPreferences/AccountPreferences'
import AccountSecurity from './AccountSecurity/AccountSecurity'
import AccountSupport from './AccountSupport/AccountSupport'
import AccountHeader from './AccountHeader/AccountHeader'
import AccountFooter from './AccountFooter/AccountFooter'


function UserAccount() {
  return (
    <div className="user-account-page">
        <AccountHeader />
        <AccountHero />
        <AccountOverview />
        <AccountRecentOrders />
        <AccountWishlist />
        <AccountAddress />
        <AccountPreferences />
        <AccountSecurity />
        <AccountSupport />
        <AccountFooter />
        </div>
  )
}

export default UserAccount
