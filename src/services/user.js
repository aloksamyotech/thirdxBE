import user from '../models/user.js'
import '../models/tags.js';
import {
  checkRole,
  errorCodes,
  externalAPI,
  Message,
  statusCodes,
} from '../core/common/constant.js'
import CustomError from '../utils/exception.js'
import axios from 'axios'
import { regexFilter } from '../core/common/common.js'
import mongoose from 'mongoose'
import { generateCustomId } from '../utils/generateCustomId.js'
import tag from '../models/tags.js'
import configuration from '../models/configuration.js'
import Services from '../models/services.js'
export const addUser = async (userData) => {
  if (
    userData?.Service &&
    (userData.Service.serviceName === '' ||
      !mongoose.Types.ObjectId.isValid(userData.Service.serviceName))
  ) {
    delete userData.Service.serviceName
  }

  userData.uniqueId = await generateCustomId()
  const newUser = await user.create(userData)
  if (!newUser) {
    return new CustomError(
      statusCodes?.badRequest,
      Message?.notCreated,
      errorCodes?.bad_request
    )
  }
  return { newUser }
}

export const getAllServiceUser = async () => {
  const allUser = await user
    .find({ isDelete: false, isActive: true, role: checkRole.service_user, isCompletlyDelete: false })
    .sort({ createdAt: -1 })
    .populate({
      path: 'otherInfo.tags',
      model: 'tag',
      populate: {
        path: 'tagCategoryId',
        model: 'tagCategory'
      }
    })
    .populate('contactPreferences.preferredMethod')
    .populate('contactPreferences.contactPurposes')
    .populate('contactPreferences.reason')
    .populate('companyInformation.recruitmentCampaign')
  if (!allUser) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }
  return { allUser }
}

export const getAllVolunteer = async () => {
  const allVolunteer = await user
    .find({ isDelete: false, role: checkRole.volunteer, isCompletlyDelete: false })
    .sort({ createdAt: -1 })
    .populate({
      path: 'otherInfo.tags',
      model: 'tag',
      populate: {
        path: 'tagCategoryId',
        model: 'tagCategory'
      }
    }).populate('contactPreferences.preferredMethod')
    .populate('contactPreferences.contactPurposes')
    .populate('contactPreferences.reason')
    .populate('companyInformation.recruitmentCampaign')
  if (!allVolunteer) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }
  return { allVolunteer }
}
export const getAllUsers = async () => {
  const allVolunteer = await user
    .find({ isDelete: false, role: checkRole.user, isCompletlyDelete: false })
    .sort({ createdAt: -1 })
    .populate({
      path: 'otherInfo.tags',
      model: 'tag',
      populate: {
        path: 'tagCategoryId',
        model: 'tagCategory'
      }
    }).populate('contactPreferences.preferredMethod')
    .populate('contactPreferences.contactPurposes')
    .populate('contactPreferences.reason')
    .populate('companyInformation.recruitmentCampaign')
  if (!allVolunteer) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }
  return { allVolunteer }
}

export const getAllDonor = async () => {
  const allDonor = await user
    .find({ isDelete: false, role: checkRole.donor, isCompletlyDelete: false })
    .sort({ createdAt: -1 })
    .populate({
      path: 'otherInfo.tags',
      model: 'tag',
      populate: {
        path: 'tagCategoryId',
        model: 'tagCategory'
      }
    }).populate('contactPreferences.preferredMethod')
    .populate('contactPreferences.contactPurposes')
    .populate('contactPreferences.reason')
    .populate('companyInformation.recruitmentCampaign')

  if (!allDonor) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }
  return { allDonor }
}

export const getUserById = async (userId) => {
  if (!userId) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }
  const userData = await user
    .findOne({ _id: userId, isDelete: false })
    .populate({
      path: 'otherInfo.tags',
      model: 'tag',
      populate: {
        path: 'tagCategoryId',
        model: 'tagCategory'
      }
    }).populate('contactPreferences.preferredMethod')
    .populate('contactPreferences.contactPurposes')
    .populate('contactPreferences.reason')
    .populate('companyInformation.recruitmentCampaign')
    .populate('riskAssessment.keyIndicators')
    .populate('Service.serviceName');

  if (!userData) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.userNotGet,
      errorCodes?.user_not_found
    )
  }
  return userData
}

export const getAllUsDistricts = async () => {
  const response = await axios.get(externalAPI.district)

  const [headers, ...rows] = response.data

  const cityStateArray = rows.map((row) => {
    const [placeWithState] = row
    const city = placeWithState
      .split(',')[0]
      .replace(/\s(city|town|CDP)$/i, '')
      .trim()
    const state = placeWithState.split(',')[1].replace(/\s+$/, '').trim()

    return `${city}, ${state}`
  })

  return {
    cities: cityStateArray,
  }
}

export const editUser = async (userData) => {
  if (
    userData?.Service &&
    (userData.Service.serviceName === '' ||
      !mongoose.Types.ObjectId.isValid(userData.Service.serviceName))
  ) {
    delete userData.Service.serviceName
  }
  const { userId, ...rest } = userData

  if (!userId) {
    return new CustomError(
      statusCodes?.badRequest,
      'Invalid user ID',
      errorCodes?.bad_request
    )
  }

  const existingUser = await user.findById({ _id: userId })

  if (!existingUser) {
    return new CustomError(
      statusCodes?.notFound,
      Message?.userNotFound || 'User not found',
      errorCodes?.not_found
    )
  }

  const updatedUser = await user.findByIdAndUpdate(
    { _id: userId },
    { $set: rest },
    { new: true, runValidators: true }
  )

  if (!updatedUser) {
    return new CustomError(
      statusCodes?.badRequest,
      Message?.userNotUpdated || 'User could not be updated',
      errorCodes?.bad_request
    )
  }

  return { updatedUser }
}

export const deleteUser = async (userId) => {
  const checkExist = await user.findById({ _id: userId })

  if (!checkExist) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }
  const statusUpdate = await user.findByIdAndUpdate(
    { _id: userId },
    { isDelete: true },
    { new: true }
  )

  if (!statusUpdate) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notUpdate,
      errorCodes?.not_found
    )
  }
  return { statusUpdate }
}

export const archiveUser = async (userId, archiveReason) => {
  const checkExist = await user.findById({ _id: userId });

  if (!checkExist) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    );
  }
  const statusUpdate = await user.findByIdAndUpdate(
    { _id: userId },
    { archive: true, archiveReason: archiveReason },
    { new: true }
  );

  if (!statusUpdate) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notUpdate,
      errorCodes?.not_found
    );
  }

  return { statusUpdate };
};
export const unArchiveUser = async (userId) => {
  const checkExist = await user.findById(userId);

  if (!checkExist) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    );
  }
  const statusUpdate = await user.findByIdAndUpdate(
    userId,
    {
      archive: false,
      archiveReason: null
    },
    { new: true }
  );

  if (!statusUpdate) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notUpdate,
      errorCodes?.not_found
    );
  }

  return { statusUpdate };
};
export const getUserwithPagination = async (query) => {
  const {
    subRole,
    startDate,
    endDate,
    search,
    status,
    district,
    createdAt,
    gender,
    nickName,
    uniqueId,
    campaigns,
    country,
    archive,
    role,
    userId,
    name,
    deleted,
    dateOfBirth,
    page = 1,
    limit = 10,
  } = query || {}
  let pageNumber = Number(page)
  let limitNumber = Number(limit)
  if (pageNumber < 1) {
    pageNumber = 1
  }

  if (limitNumber < 1) {
    limitNumber = 10
  }
  const skip = (pageNumber - 1) * limitNumber
  const searchKeys = {
    'personalInfo.firstName': search,
    'personalInfo.lastName': search,
    'companyInformatiom.companyName': search,
    'uniqueId': search,
    role: search,
    subRole: search,
    uniqueId: search,
  }

  const searchConditions = Object.entries(regexFilter(searchKeys)).map(
    ([key, value]) => ({
      [key]: value,
    })
  )

  const filter = {


    $or: searchConditions,
    isCompletlyDelete: false,
    ...(status !== undefined &&
      status !== '' && { isActive: status === 'true' }),
    ...(archive !== undefined && archive !== '' && { archive: archive }),
    ...(district !== undefined &&
      district !== '' && { 'contactInfo.district': district }),
    ...(gender !== undefined &&
      gender !== '' && { 'personalInfo.gender': gender }),
    ...(nickName !== undefined &&
      nickName !== '' && { 'personalInfo.nickName': nickName }),
    ...(subRole !== undefined &&subRole !== '' && { subRole : subRole }),
    ...(typeof deleted !== 'undefined' ? { isDelete: deleted === 'true' } : { isDelete: false }),

    ...(campaigns !== undefined &&
      campaigns !== '' && {
      'companyInformation.recruitmentCampaign': campaigns,
    }),
    ...(country !== undefined &&
      country !== '' && { 'contactInfo.country': country }),
    ...(role !== undefined && role !== '' && { role: role }),
    ...(userId !== undefined &&
      userId !== '' && { caseId: new mongoose.Types.ObjectId(userId) }),
    ...(name !== undefined && name !== '' && { _id: name }),

    ...(createdAt !== undefined &&
      createdAt !== '' && {
      createdAt: {
        $gte: new Date(createdAt),
        $lt: new Date(
          new Date(createdAt).setDate(new Date(createdAt).getDate() + 1)
        ),
      },
    }),
    ...(startDate && endDate && {
      createdAt: {
        $gte: new Date(new Date(startDate).setHours(0, 0, 0, 0)),
        $lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)),
      }
    }),
    ...(uniqueId !== undefined && uniqueId !== '' && { _id: uniqueId }),
    ...(dateOfBirth !== undefined &&
      dateOfBirth !== '' && {
      'personalInfo.dateOfBirth': {
        $gte: new Date(new Date(dateOfBirth).setHours(0, 0, 0, 0)),
        $lt: new Date(new Date(dateOfBirth).setHours(23, 59, 59, 999)),
      },
    }),
  }

  const allUser = await user
    .find(filter)
    .skip(skip)
    .limit(limitNumber)
    .sort({ createdAt: -1 })
    .populate({
      path: 'otherInfo.tags',
      model: 'tag',
      populate: {
        path: 'tagCategoryId',
        model: 'tagCategory'
      }
    })
    .populate('contactPreferences.preferredMethod')
    .populate('contactPreferences.contactPurposes')
    .populate('contactPreferences.reason')
    .populate('companyInformation.recruitmentCampaign')
    .populate('Service.serviceName')

  const total = await user.countDocuments(filter)
  return {
    data: allUser,
    meta: {
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
    },
  }
}

export const isExistUser = async (userId) => {
  const exists = await user.exists({ _id: userId })
  return Boolean(exists)
}

const getTagIdsByNames = async (names) => {
  if (!names) return [];
  const nameArray = names.split(',').map(n => n.trim());
  const tags = await tag.find({ name: { $in: nameArray } }).select('_id');
  return tags.map(tag => tag._id);
};

const getConfigIdByName = async (name, configType) => {
  if (!name) return null;
  const config = await configuration.findOne({
    name: { $regex: `^${name.trim()}$`, $options: 'i' },
    configurationType: configType
  }).select('_id');

  return config?._id || null;
};
const getConfigRiskIndicator = async (name, configType) => {
  if (!name) return [];
  const nameArray = name.split(',').map(n => n.trim());
  const Indicators = await configuration?.find({ name: { $in: nameArray }, configurationType: configType }).select('_id');
  return Indicators.map(Indicator => Indicator._id);
};
const getServiceName = async (name) => {
  if (!name) return null;
  const Service = await Services.findOne({ name: name.trim() }).select('_id');
  return Service?._id || null;
};

export const bulkUploadUsers = async (services) => {
  const results = [];

  for (const data of services) {
    try {
      const userData = {
        personalInfo: {
          title: data?.personalInfo_title,
          gender: data?.personalInfo_gender,
          firstName: data?.personalInfo_firstname,
          lastName: data?.personalInfo_lastname,
          nickName: data?.personalInfo_preferred_name,
          profileImage: data?.personalInfo_profile_image,
          dateOfBirth: data?.personalInfo_dob,
          ethnicity: data?.personalInfo_ethnicity,
        },
        contactInfo: {
          homePhone: data?.contactInfo_homephone,
          phone: data?.contactInfo_phone,
          email: data?.contactInfo_email,
          addressLine1: data?.contactInfo_addressLine1,
          addressLine2: data?.contactInfo_addressLine2,
          town: data?.contactInfo_town,
          district: data?.contactInfo_district,
          postcode: data?.contactInfo_postcode,
          country: data?.contactInfo_country,
          firstLanguage: data?.contactInfo_firstLanguage,
          otherId: data?.contactInfo_other_id,
        },

        emergencyContact: {
          title: data?.emergencyContact_title,
          gender: data?.emergencyContact_gender,
          firstName: data?.emergencyContact_firstname,
          lastName: data?.emergencyContact_lastname,
          relationshipToUser: data?.emergencyContact_relationship_to_user,
          homePhone: data?.emergencyContact_homephone,
          phone: data?.emergencyContact_phone,
          email: data?.emergencyContact_email,
          addressLine1: data?.emergencyContact_addressLine1,
          addressLine2: data?.emergencyContact_addressLine2,
          country: data?.emergencyContact_country,
          town: data?.emergencyContact_town,
          postcode: data?.emergencyContact_postcode,
        },
        otherInfo: {
          file: data.otherInfo_file,
          description: data.otherInfo_notes,
          tags: await getTagIdsByNames(data?.otherInfo_tags),
          restrictAccess: data?.otherInfo_restrict_access == true || data?.otherInfo_restrict_access == "true"
        },
        riskAssessment: {
          riskAssessmentNotes: data?.riskAssessment_notes,
          keyIndicators: await getConfigRiskIndicator(data.riskAssessment_key_indicators, "Key Indicators")
        },
        contactPreferences: {
          contactPurposes: await getConfigRiskIndicator(data.contactPreferences_contactPurposes, 'Contact Purpose'),
          dateOfConfirmation: data.contactPurposes_dateOfConfirmation,
          reason: await getConfigIdByName(data.contactPurposes_reason, 'Reason'),
          contactMethods: {
            telephone: data.contactPurposes_contactMethods_telephone == 'true' || data.contactPurposes_contactMethods_telephone == true,
            email: data.contactPurposes_contactMethods_email == 'true' || data.contactPurposes_contactMethods_email == true,
            letter: data.contactPurposes_contactMethods_letter == 'true' || data.contactPurposes_contactMethods_letter == true,
            sms: data.contactPurposes_contactMethods_sms == 'true' || data.contactPurposes_contactMethods_sms == true,
            whatsapp: data.contactPurposes_contactMethods_whatsapp == 'true' || data.contactPurposes_contactMethods_whatsapp == true,
          },
        },
        Service: [
          {
            serviceName: await getServiceName(data?.service_name),
            startDate: data?.service_startDate,
            lastDate: data?.service_lastDate,
            referrerName: data?.service_referrer_name,
            referrerJob: data?.service_referrer_job,
            referrerPhone: data?.service_referrer_phone,
            referrerEmail: typeof data?.service_referrer_email === 'object' ? data.service_referrer_email.text : data?.service_referrer_email,
            emergencyPhone: data?.service_emergency_phone,
            emergencyEmail: typeof data?.service_emergency_email === 'object' ? data.service_emergency_email.text : data?.service_emergency_email,
            referralType: data.service_referral_type,
            referredDate: data.service_referred_date
          }
        ],
        role: data.role || 'service_user',
        uniqueId: await generateCustomId()
      };

      const newUser = new user(userData);
      await newUser.save();
      results.push(newUser);
    } catch (err) {
      console.error("Failed to save:", data, err);
    }
  }

  return { results };
};

export const bulkUploadDonor = async (donors) => {
  const results = [];

  for (const data of donors) {
    try {
      // Build nested structure from flat keys
      const userData = {
        personalInfo: {
          title: data?.personalInfo_title,
          gender: data?.personalInfo_gender,
          firstName: data?.personalInfo_firstname,
          lastName: data?.personalInfo_lastname,
          dateOfBirth: data?.personalInfo_dob,
        },
        contactInfo: {
          homePhone: data?.contactInfo_homephone,
          phone: data?.contactInfo_phone,
          email: data?.contactInfo_email,
          addressLine1: data?.contactInfo_addressLine1,
          addressLine2: data?.contactInfo_addressLine2,
          district: data?.contactInfo_district,
          postcode: data?.contactInfo_postcode,
          country: data?.contactInfo_country,
        },
        otherInfo: {
          file: data.otherInfo_file,
          description: data.otherInfo_notes,
          tags: await getTagIdsByNames(data?.otherInfo_tags),
          restrictAccess: data?.otherInfo_restrict_access == true || data?.otherInfo_restrict_access == "true"
        },
        contactPreferences: {
          contactPurposes: await getConfigRiskIndicator(data.contactPreferences_contactPurposes, 'Contact Purpose'),
          dateOfConfirmation: data.contactPurposes_dateOfConfirmation,
          reason: await getConfigIdByName(data.contactPurposes_reason, 'Reason'),
          contactMethods: {
            donor: data.contactPurposes_contactMethods_donerTag == 'true' || data.contactPurposes_contactMethods_donerTag == true,
            email: data.contactPurposes_contactMethods_email == 'true' || data.contactPurposes_contactMethods_email == true,
            letter: data.contactPurposes_contactMethods_letter == 'true' || data.contactPurposes_contactMethods_letter == true,
            sms: data.contactPurposes_contactMethods_sms == 'true' || data.contactPurposes_contactMethods_sms == true,
            whatsapp: data.contactPurposes_contactMethods_whatsapp == 'true' || data.contactPurposes_contactMethods_whatsapp == true,
          },
        },
        companyInformation: {
          companyName: data.companyInformation_companyName || "",
          mainContactName: data.companyInformation_mainContact || "",
          socialMediaLinks: data.companyInformation_socialMediaLinks,
          recruitmentCampaign: await getConfigIdByName(data.companyInformation_recruitmentCampaign, "Campaign"),
        },
        role: data.role || 'donor',
        subRole: data.subRole || 'donar_individual',
        uniqueId: await generateCustomId()
      };
      const newUser = new user(userData);
      await newUser.save();
      results.push(newUser);
    } catch (err) {
      console.error("Failed to save:", data, err);
    }
  }

  return { results };
};
