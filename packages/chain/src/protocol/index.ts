// import { VanillaProtocolModules } from "@proto-kit/library";
import { VanillaProtocolModules } from "../library/protocol/VanillaProtocolModules";
import { ModulesConfig } from "@proto-kit/common";

const modules = VanillaProtocolModules.with({});

const config: ModulesConfig<typeof modules> = {
  ...VanillaProtocolModules.defaultConfig(),
};

export default { modules, config };
