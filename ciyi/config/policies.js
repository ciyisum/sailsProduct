/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your controllers.
 * You can apply one or more policies to a given controller, or protect
 * its actions individually.
 *
 * Any policy file (e.g. `api/policies/authenticated.js`) can be accessed
 * below by its filename, minus the extension, (e.g. "authenticated")
 *
 * For more information on how policies work, see:
 * http://sailsjs.org/#/documentation/concepts/Policies
 *
 * For more information on configuring policies, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.policies.html
 */


module.exports.policies = {

  /***************************************************************************
  *                                                                          *
  * Default policy for all controllers and actions (`true` allows public     *
  * access)                                                                  *
  *                                                                          *
  ***************************************************************************/

  // '*': true,

  /***************************************************************************
  *                                                                          *
  * Here's an example of mapping some policies to run before a controller    *
  * and its actions                                                          *
  *                                                                          *
  ***************************************************************************/
	// RabbitController: {

		// Apply the `false` policy as the default for all of RabbitController's actions
		// (`false` prevents all access, which ensures that nothing bad happens to our rabbits)
		// '*': false,

		// For the action `nurture`, apply the 'isRabbitMother' policy
		// (this overrides `false` above)
		// nurture	: 'isRabbitMother',

		// Apply the `isNiceToAnimals` AND `hasRabbitFood` policies
		// before letting any users feed our rabbits
		// feed : ['isNiceToAnimals', 'hasRabbitFood']
	// }
  adminuser: {
    'useradd': 'sessionAuth',
    'add': 'sessionAuth',
    'userindex': 'sessionAuth',
    'update': 'sessionAuth',
    'delete': 'sessionAuth',
    'reset': 'sessionAuth',
    'profile': 'sessionAuth',
    'pupdate': 'sessionAuth',
    'userlock': 'sessionAuth',
    'userfind': 'sessionAuth',
    'lock': 'sessionAuth',
    'passreset': 'sessionAuth',
    'userliftbanfind': 'sessionAuth',
    'lockDelete': 'sessionAuth',
    'userliftbanfindcount': 'sessionAuth'
  },
  region: {
    'auditlist': 'sessionAuth',
    'room': 'sessionAuth',
    'audit': 'sessionAuth',
    'regionlist': 'sessionAuth',
    'regionadd': 'sessionAuth',
    'add': 'sessionAuth',
    'update': 'sessionAuth'
  },
  room: {
    'index': 'sessionAuth',
    'add': 'sessionAuth',
    'roomadd': 'sessionAuth',
    'edit': 'sessionAuth',
    'update': 'sessionAuth',
    'search': 'sessionAuth',
    'auditlist': 'sessionAuth',
    'audit': 'sessionAuth',
    'auditpaylist': 'sessionAuth',
    'auditpay': 'sessionAuth',
    'cardud': 'sessionAuth',
    'roomliftbanfind': 'sessionAuth',
    'roomliftbancount': 'sessionAuth'
  },
  broadcast: {
    'history': 'sessionAuth',
    'record': 'sessionAuth',
    'add': 'sessionAuth',
    'create': 'sessionAuth',
    'edit': 'sessionAuth',
    'update': 'sessionAuth',
    'delete': 'sessionAuth',
    'send': 'sessionAuth',
    'search': 'sessionAuth',
    'getfms': 'sessionAuth',
    'getfmJson': 'sessionAuth',
    'addfmview': 'sessionAuth',
    'addfm': 'sessionAuth',
    'updatefm': 'sessionAuth',
    'sendfm': 'sessionAuth'
  },
   platform :{
    'GetAdInfo':'sessionAuth',
    'GetAdInfoJson':'sessionAuth',
    'GetAddAdPage':'sessionAuth',
    'AddAdInfo':'sessionAuth',
    'DeleteAdInfo':'sessionAuth',
    'OpenAdInfo':'sessionAuth',
    'GetGiftStatistics':'sessionAuth',
    'GetGiftStatisticsExcel':'sessionAuth',
    'GetGiftAddPage':'sessionAuth',
    'AddGiftInfo':'sessionAuth',
    'GetGiftInfo':'sessionAuth',
    'DeleteGifoInfo':'sessionAuth',
    'GetGiftOfficial':'sessionAuth'
   }
};
