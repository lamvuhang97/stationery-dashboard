import { response } from "./response.js";
import { authentications } from "./authentications";
import { users } from "./users";
import { products } from "./products";
import { categories } from "./categories";
import { orders } from "./orders"; 
import { reviews } from "./reviews";
import {history} from "./history";

import { subscribers } from "./subscribers";
import { videos } from "./videos";
import { tokens } from "./tokens";
import { documents } from "./documents";
import { entitlements } from "./entitlements";
import { transactions } from "./transactions";
import { views } from "./views";
import { collections } from "./collections";
import { locations } from "./locations";
import { tags } from "./tags";

const api = {
  response,
  authentications,
  users,
  products,
  categories,
  orders,
  reviews,
  subscribers,
  videos,
  tokens,
  documents,
  entitlements,
  transactions,
  views,
  collections,
  locations,
  tags,
  history
};

export default api;
