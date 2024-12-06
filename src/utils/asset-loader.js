import.meta.glob("/public/assets/data/*.json");

const mockMapData = {
  type: "FeatureCollection",
  features: [
    // 简单的地理数据
  ],
};

const mockValueData = [
  { name: "测试区域1", value: 100 },
  { name: "测试区域2", value: 200 },
];

const modules = import.meta.glob("/public/assets/data/*.json", { eager: true });

export const loadMapAsset = async (jsonfile, type = "full") => {
  try {
    const key = `/public/assets/data/${jsonfile}_${type}.json`;
    const moduleData = modules[key];
    const result = moduleData?.default;

    return result || null;
  } catch (error) {
    return null;
  }
};
