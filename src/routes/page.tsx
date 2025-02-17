import React, { useState } from "react";
import { Controlled as CodeMirror, UnControlled as CodeMirror2 } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css"; // 使用 Dracula 主题
import "codemirror/mode/javascript/javascript"; // 引入 JavaScript 语法高亮
import { parser } from "@/lib/thriftNew";
import { print } from "@/lib/thriftNew/print";
import { prettier } from "@/lib/tools/format";
import './globals.css'

const START_THRIFT = `namespace java com.example.thrift
namespace py example.thrift

const string test = 'test'

// 定义一个枚举类型，表示用户的状态
enum UserStatus {
    ACTIVE = 0,  // 用户活跃
    INACTIVE = 1,  // 用户不活跃
    SUSPENDED = 2,  // 用户被暂停
    DELETED = 3  // 用户已删除
}

// 定义一个枚举类型，表示订单的状态
enum OrderStatus {
    PENDING = 0,  // 待处理
    SHIPPED = 1,  // 已发货
    DELIVERED = 2,  // 已送达
    CANCELED = 3  // 已取消
}

// 定义一个复杂数据结构 - 用户
struct User {
    1: required i32 user_id;  // 必选的用户ID
    2: required string name;  // 必选的用户名
    3: optional string email;  // 可选的电子邮件
    4: required UserStatus status;  // 必选的用户状态
    5: optional string phone_number;  // 可选的电话号码
    6: required i64 created_at;  // 必选的创建时间
    7: optional i64 last_login;  // 可选的最后登录时间
    8: optional map<string, string> preferences;  // 可选的用户偏好设置
    9: optional list<i32> friend_ids;  // 可选的朋友ID列表
}

// 定义一个复杂数据结构 - 地址
struct Address {
    1: required string street;  // 必选的街道
    2: required string city;  // 必选的城市
    3: required string state;  // 必选的州
    4: required string country;  // 必选的国家
    5: required string zip_code;  // 必选的邮政编码
    6: optional string phone_number;  // 可选的地址关联电话号码
}

// 定义一个复杂数据结构 - 订单
struct Order {
    1: required i32 order_id;  // 必选的订单ID
    2: required i32 user_id;  // 必选的用户ID（订单关联的用户）
    3: required list<i32> product_ids;  // 必选的产品ID列表
    4: required double total_amount;  // 必选的订单总金额
    5: required OrderStatus status;  // 必选的订单状态
    6: required i64 created_at;  // 必选的创建时间
    7: optional string shipping_address;  // 可选的配送地址
    8: optional Address billing_address;  // 可选的账单地址
    9: optional i64 shipping_time;  // 可选的发货时间
    10: optional list<string> order_notes;  // 可选的订单备注
    11: optional map<string, string> order_metadata;  // 可选的订单元数据
}

// 定义一个复杂的数据结构 - 商品
struct Product {
    1: required i32 product_id;  // 必选的商品ID
    2: required string name;  // 必选的商品名称
    3: required double price;  // 必选的商品价格
    4: required string description;  // 必选的商品描述
    5: optional string image_url;  // 可选的商品图片URL
    6: optional bool in_stock;  // 可选的库存状态
}

// 定义一个复杂的数据结构 - 购物车
struct Cart {
    1: required i32 cart_id;  // 必选的购物车ID
    2: required i32 user_id;  // 必选的用户ID
    3: required list<Product> products;  // 必选的商品列表
    4: required double total_price;  // 必选的购物车总价格
    5: optional i64 created_at;  // 可选的购物车创建时间
    6: optional bool is_active;  // 可选的购物车是否有效
}

// 定义一个复杂的数据结构 - 支付信息
struct PaymentInfo {
    1: required string payment_method;  // 必选的支付方式
    2: required double amount;  // 必选的支付金额
    3: required i64 payment_time;  // 必选的支付时间
    4: optional string transaction_id;  // 可选的交易ID
    5: optional string payment_status;  // 可选的支付状态
}

// 定义一个包含多个复杂结构的复杂数据结构
struct UserProfile {
    1: required i32 user_id;  // 必选的用户ID
    2: required string username;  // 必选的用户名
    3: optional string avatar_url;  // 可选的头像URL
    4: required string bio;  // 必选的个人简介
    5: optional list<Address> addresses;  // 可选的地址列表
    6: required list<Order> orders;  // 必选的订单列表
    7: optional Cart cart;  // 可选的购物车
    8: optional list<PaymentInfo> payment_history;  // 可选的支付历史
}

struct MyStruct {
	1: optional string test
}

service MyService {
	void ping()
}

// 服务接口，定义用户相关操作
service UserService {
    // 创建新用户
    void createUser(1: required string name, 2: required string email);

    // 获取用户资料
    UserProfile getUserProfile(1: required i32 user_id);

    // 更新用户资料
    void updateUserProfile(1: required i32 user_id, 2: required UserProfile user_profile);

    // 获取用户的所有订单
    list<Order> getUserOrders(1: required i32 user_id);

    // 创建一个新的订单
    void createOrder(1: required i32 user_id, 2: required list<i32> product_ids, 3: required double total_amount);

    // 获取订单详情
    Order getOrderDetails(1: required i32 order_id);
}

// 服务接口，定义订单相关操作
service OrderService {
    // 创建新订单
    void createOrder(1: required i32 user_id, 2: required list<i32> product_ids, 3: required double total_amount);

    // 获取订单信息
    Order getOrder(1: required i32 order_id);

    // 更新订单状态
    void updateOrderStatus(1: required i32 order_id, 2: required OrderStatus status);
}

// 服务接口，定义商品相关操作
service ProductService {
    // 获取商品列表
    list<Product> getProducts(1: required i32 page, 2: required i32 page_size);

    // 获取单个商品详情
    Product getProductDetails(1: required i32 product_id);
}
`

export default function Home() {
  const [thrift, setThrift] = useState(START_THRIFT);

  const [tsCode, setTsCode] = useState("");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (editor: any, data: any, value: any) => {
    setThrift(value);
  };

  const handleClick = async () => {
    const ast = parser("", thrift);
    const tsCode = await print(ast);
    // const result = await prettier(tsCode);
    setTsCode(tsCode);
  };
  return (
    <div className="App flex px-[15px] py-[15px] flex-col">
      <h1 className="text-[24px] font-600 mb-[10px]">Thrift 转换 Typescript</h1>

      <div className="flex">
        <CodeMirror
          value={thrift}
          options={{
            mode: "javascript", // 设置编辑器模式为 JavaScript
            theme: "dracula", // 使用 Dracula 主题
            lineNumbers: true, // 显示行号
            indentUnit: 2, // 设置缩进空格为 2
            tabSize: 2, // 设置 Tab 大小为 2
            autoCloseBrackets: true, // 自动闭合括号
            matchBrackets: true, // 匹配括号
            showCursorWhenSelecting: true, // 选中时显示光标
          }}
          onBeforeChange={handleChange} // 每次编辑内容变化时更新 state
        />
        <div className="mx-[10px] flex">
          <button
            className="h-[30px] w-[50px] rounded-[10%] border border-solid m-auto cursor-pointer"
            onClick={handleClick}
          >
            转换
          </button>
        </div>

        <CodeMirror2
          value={tsCode}
          options={{
            mode: "javascript", // 设置编辑器模式为 JavaScript
            theme: "dracula", // 使用 Dracula 主题
            lineNumbers: true, // 显示行号
            indentUnit: 2, // 设置缩进空格为 2
            tabSize: 2, // 设置 Tab 大小为 2
            autoCloseBrackets: true, // 自动闭合括号
            matchBrackets: true, // 匹配括号
            showCursorWhenSelecting: true, // 选中时显示光标
            readOnly: true,
          }}
        />

        {/* <button onClick={() => alert(code)}>查看代码</button> */}
      </div>
    </div>
  );
}
