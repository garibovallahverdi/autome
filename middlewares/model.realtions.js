import Bid from "../models/bide.model.js";
import LotFeaturesDetails from "../models/lot.details.model.js";
import Lot from "../models/lot.model.js";
import User from "../models/user.model.js";


export default function ModelRelations(){
    
    Lot.hasMany(Bid,{as:'LotBids',foreignKey:'lotId'})
    Bid.belongsTo(Lot,{as:'LotBids',foreignKey:'lotId'})
    User.hasMany(Bid,{as:'BidUser',foreignKey:'userId'})
    Bid.belongsTo(User,{as:'BidUser',foreignKey:'userId'})
    User.hasMany(Lot,{as:'OwnLots',foreignKey:'ownerId'})
    Lot.belongsTo(User,{as:'OwnLots',foreignKey:'ownerId'})
    User.belongsToMany(Lot,{through:'User_Joined',as:'JoinedLots'})
    Lot.belongsToMany(User,{through:'User_Joined',as:'LotBidders'})
    User.belongsToMany(Lot,{through:'LikeLot',as:'UserLikeLots'})
    Lot.belongsToMany(User,{through:'LikeLot',as:'LotLikers'})
    Lot.hasOne(LotFeaturesDetails)
    LotFeaturesDetails.belongsTo(Lot)
} 