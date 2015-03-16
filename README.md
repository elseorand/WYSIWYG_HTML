<nav id="table-of-contents">
<h2>Table of Contents</h2>
<div id="text-table-of-contents">
<ul>
<li><a href="#sec-1">1. WYSIWYG_HTML</a>
<ul>
<li><a href="#sec-1-1">1.1. Examples : Tag and part_list</a>
<ul>
<li><a href="#sec-1-1-1">1.1.1. Example : simple =&gt; sibling &amp; parent-child</a></li>
<li><a href="#sec-1-1-2">1.1.2. Example : nest</a></li>
<li><a href="#sec-1-1-3">1.1.3. Example : variables &amp; calculation</a></li>
<li><a href="#sec-1-1-4">1.1.4. Example : a diff of emmet</a></li>
</ul>
</li>
</ul>
</li>
</ul>
</div>
</nav>


# WYSIWYG\_HTML<a id="sec-1"></a>

Creating a HTML mock on Real browser.  
        emmet-like inputting, but not the same.

## Examples : Tag and part\_list<a id="sec-1-1"></a>

### Example : simple => sibling & parent-child<a id="sec-1-1-1"></a>

-   input Tag:
    article>header+section+footer
-   output HTML:
    
        <article>
        <header></header>
        <section></section>
        <footer></footer>
        </article>
    
    -   ">" means parent > child.
    -   "+" means sibling.

### Example : nest<a id="sec-1-1-2"></a>

-   input Tag:
    article>MyHeader+MySectionParagraph(3)+footer
-   input part\_list:
    -   MyHeader | header>h3
    -   MySectionParagraph | section>p\*$0
-   output HTML:
    
        <article>
                <header>
                <h3></h3>
                </header>
        <section>
        <p></p>
        <p></p>
        <p></p>
        </section>
        <footer></footer>
        </article>
-   "tag\*num" means outputting the tag num times.
-   "$n" means The n-th param.(zero origin)
-   Not supported : Nest by parenthesis.

### Example : variables & calculation<a id="sec-1-1-3"></a>

-   input Tag:
    tr>th\*($a 3 =)+td\*$a  
                     (Or "tr>th\*$a 3 =+td\*$a" is also OK, however bad coding.)
    
        <tr>
          <th></th><th></th><th></th>
          <td></td><td></td><td></td>
        </tr>
-   variables name style : $name.
-   calculation : reversed porlish notation  
                            you can use  + - \* / % ( ) =. parenthesis are used for nesting.  
                            (I'm Japanese. And I adopt this since this notation resembles the word order of Japanese Language.)

### Example : a diff of emmet<a id="sec-1-1-4"></a>

-   input Tag:
    article>section+div>span
-   output HTML:
    
        <article>
          <section>
            <span></span>
                </section>
                <div>
            <span></span>
                </div>
        </article>
