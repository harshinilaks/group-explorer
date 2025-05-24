import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  members: [String],
  cayleyTable: [[String]],
  identity: String,
  //mongoose.Schema.Types.Mixed --> this allows for flexible objects!!
  cycleGroups: mongoose.Schema.Types.Mixed
});

const Group = mongoose.model('Group', groupSchema);
export default Group;
