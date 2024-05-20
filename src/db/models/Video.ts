import db from '../../connection'
import { v4 as uuidv4 } from 'uuid'
import { DataTypes, Model, Optional } from 'sequelize'
import PRIVACY from '../../constants/video'

export interface VideoAttributes {
  id: string
  content: string
  title: string
  url: string
  public_id: string
  tag: string
  privacy: string
  view: number
  category_video_id: string
  user_id: string
  createdAt: Date
  updatedAt: Date
}

interface VideoCreationAttribute
  extends Optional<
    VideoAttributes,
    | 'id'
    | 'content'
    | 'title'
    | 'url'
    | 'public_id'
    | 'tag'
    | 'privacy'
    | 'view'
    | 'category_video_id'
    | 'user_id'
    | 'createdAt'
    | 'updatedAt'
  > {}

class VideoModal extends Model<VideoAttributes, VideoCreationAttribute> implements VideoAttributes {
  declare id: string
  declare content: string
  declare title: string
  declare url: string
  declare public_id: string
  declare tag: string
  declare privacy: string
  declare view: number
  declare category_video_id: string
  declare user_id: string
  declare readonly createdAt: Date
  declare readonly updatedAt: Date
}

VideoModal.init(
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING,
      defaultValue: () => uuidv4()
    },
    content: {
      allowNull: true,
      type: DataTypes.STRING
    },
    title: {
      allowNull: true,
      type: DataTypes.STRING
    },
    url: {
      allowNull: true,
      type: DataTypes.STRING
    },
    public_id: {
      allowNull: true,
      type: DataTypes.STRING
    },
    tag: {
      allowNull: true,
      type: DataTypes.STRING
    },
    privacy: {
      allowNull: false,
      type: DataTypes.ENUM(PRIVACY.private, PRIVACY.public),
      defaultValue: PRIVACY.public
    },
    view: {
      allowNull: false,
      type: DataTypes.NUMBER,
      defaultValue: 0
    },
    category_video_id: {
      allowNull: true,
      type: DataTypes.STRING
    },
    user_id: {
      allowNull: false,
      type: DataTypes.STRING
    },
    createdAt: {
      allowNull: true,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: true,
      type: DataTypes.DATE
    }
  },
  {
    sequelize: db, // Kết nối Sequelize instance
    tableName: 'videos', // Tên bảng trong cơ sở dữ liệu
    modelName: 'videos', // Tên mô hình
    timestamps: true // Tự động thêm createdAt và updatedAt
  }
)

export default VideoModal
