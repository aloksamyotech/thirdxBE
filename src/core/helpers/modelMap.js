import Case from "../../models/cases.js"
import Services from "../../models/services.js";
import user from "../../models/user.js";
import mail from "../../models/mail.js"
import transaction from "../../models/transaction.js"
import Form from "../../models/form.js"
import list from "../../models/list.js";


export const modelMap = {
    service_user: user,
    volunteer: user,
    services: Services,
    cases: Case,
    donor: user,
    mailing_list: mail,
    donation: transaction,
    form: Form,
    list: list
};